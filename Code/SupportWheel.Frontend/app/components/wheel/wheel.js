(function () {

  'use strict';

  /**
  * @ngdoc overview
  * @name components.wheel
  *
  * @description
  *
  * # wheel - Component #
  *
  * This component is responsible to render a fortune wheel to present the data
  *
  * @example
    <pre>
     <sw-wheel></sw-wheel>
    </pre>
  */
  angular
    .module('components.wheel', [
      'shared.services.service.engineer',
      'shared.services.factory.handleException'
    ])


    /**
    * @ngdoc directive
    * @name components.wheel.directive:wheel
    *
    * @restrict 'E'
    * 
    * @description
    *
    * This component will render a wheel
    *
    */
    .component('swWheel', {
      templateUrl: 'app/components/wheel/wheel.html',
      controller: WheelController,
      styleUrls: ['app/components/wheel/wheel.css'],
      bindings: {

      }
    });


  //Inject Dependencies
  WheelController.$inject = ['handleExceptionFactory', 'engineerService', '$scope'];




  /**
   * @ngdoc controller
   * @name components.wheel.controller:WheelController
   * @description
   *
   * It has the logic behind the component
   *
   */
  function WheelController(handleExceptionFactory, engineerService, $scope) {
    var vm = this;
    vm.engineersNames = [];
    vm.engineers = [];

    //Init component
    vm.$onInit = init;

    




    /**
        * @ngdoc function
        * @name init
        * @methodOf  components.engineer.engineer.list.controller:EngineerListController
        * @private
        *
        * @description
        *
        * This is a private function that is called when the controller is initialized
        */
    function init() {

      function loadEngineers() {
        //Get projects based on the criteria selected
        engineerService
          .load({ cache: false })
          .then(function (data) {
            vm.engineers = data;
            vm.engineerNames = [];
            for (var d = 0; d < data.length-3; d++) {
              vm.engineersNames.push(data[d].strNameEngineer);
            }
            handleChange();
          })
          .catch(handleExceptionFactory);
      }


      //Listen for changes on instituição
      var engineerEvent = engineerService.listenEvent.both.all(loadEngineers);

      //Cleanup events when controller is destroyed
      $scope.$on("$destroy", engineerEvent);

      loadEngineers();
    }

   //Wheel Font Base:  https://codepen.io/larrybotha/pen/yMmQyG
    const COLORS = [
      '#f7d046',
      '#ff4c5a',
      '#f08cba',
      '#49c4d2',
      '#924e84',
      '#fd926f',
      '#245a65',
      '#ff6a76',
      '#633d89',
      '#000000'
    ];
    const PI = Math.PI;
    const TAU = PI * 2;

    const degToRad = (deg) =>
      deg / 180 * PI;

    const getCoordOnCircle = (r, angleInRad, { cx, cy }) => {
      return {
        x: cx + r * Math.cos(angleInRad),
        y: cy + r * Math.sin(angleInRad),
      };
    };

    const wheelFactory = (mountElem) => {
      if (!mountElem || !('nodeType' in mountElem)) {
        throw new Error('no mount element provided');
      }

      const eventMap = {
        mousedown: handleCursorDown,
        touchstart: handleCursorDown,
        mousemove: handleCursorMove,
        touchmove: handleCursorMove,
        mouseup: handleCursorUp,
        touchend: handleCursorUp,
      };
      const ratios = {
        tickerRadius: .06, // of width
        textSize: .12, // of radius
        edgeDist: .14, // of radius
      };
      let options = {
        width: 240,
        height: 240,
        type: 'svg',
      };
      const friction = .99;
      const maxSpeed = .7;
      let isGroupActive = false;
      let textDistFromEdge = 30;
      let curPosArr = [];
      let dirScalar = 1;
      let lastCurTime;
      let speed;
      let words;
      let two;
      let group;

      function init(opts) {
        options = Object.assign({}, options, opts);
        two = new Two({
          type: Two.Types[options.type],
          width: options.width,
          height: options.height,
        }).bind('resize', handleResize).play();

        initEvents();
        two.appendTo(mountElem);
        setViewBox(options.width, options.height);

        two.renderer.domElement.setAttribute(
          'style',
          `
        -moz-user-select:none;
        -ms-user-select:none;
        -webkit-user-select:none;
        user-select:none;
        -webkit-tap-highlight-color: rgba(0,0,0,0);
      `
        );
      }

      function setWords(wordsArr) {
        words = wordsArr;
      }

      function setViewBox(width, height) {
        two.renderer.domElement.setAttribute(
          'viewBox',
          `0 0 ${width} ${height}`
        );
      }

      function drawTicker() {
        const { width } = two;
        const outerRadius = ratios.tickerRadius * width;

        const tickerCircle = drawTickerCircle(outerRadius);
        const circleCenter = tickerCircle.translation;

        drawTickerArrow(outerRadius, degToRad(30), circleCenter);
      }

      function drawTickerCircle(outerRadius) {
        const { width } = two;
        const arc = two.makeArcSegment(
          width / 2, outerRadius,
          outerRadius, outerRadius * .5,
          0, 2 * PI
        );
        arc.noStroke();

        return arc;
      }

      function drawTickerArrow(radius, tangentAngle, tickerCenter) {
        const { x, y } = tickerCenter;

        const pointA = getCoordOnCircle(
          radius, PI / 2, { cx: x, cy: y }
        );
        const pointB = getCoordOnCircle(
          radius, tangentAngle, { cx: x, cy: y }
        );
        const pointC = {
          x: x,
          y: y + radius / Math.cos(PI / 2 - tangentAngle),
        };
        const pointD = getCoordOnCircle(
          radius, PI - tangentAngle, { cx: x, cy: y }
        );
        const path = two.makePath(
          pointA.x, pointA.y,
          pointB.x, pointB.y,
          pointC.x, pointC.y,
          pointD.x, pointD.y
        );
        path.noStroke();

        path.fill ="#3f51b5"

        return path;
      }

      function drawWheel() {
        if (group) { destroyPaths(); }

        const { width, height } = two;
        const numColors = COLORS.length;
        const rotationUnit = 2 * PI / words.length;
        const yOffset = width * ratios.tickerRadius * 2;
        const radius = (width - yOffset) / 2;
        const center = {
          x: width / 2,
          y: radius + yOffset,
        };
        group = two.makeGroup();

        words.map((word, i, arr) => {
          const angle = rotationUnit * i - (PI + rotationUnit) / 2;
          const arc = two.makeArcSegment(
            center.x, center.y,
            0, radius,
            0, 2 * PI / arr.length
          );
          arc.rotation = angle;
          arc.noStroke();
          arc.fill = COLORS[i % numColors];

          const textVertex = {
            x: center.x + (radius - radius * ratios.edgeDist) * Math.cos(angle + rotationUnit / 2),
            y: center.y + (radius - radius * ratios.edgeDist) * Math.sin(angle + rotationUnit / 2),
          };

          const text = two.makeText(word, textVertex.x, textVertex.y);
          text.rotation = rotationUnit * i - PI / 2;
          text.alignment = 'right';
          text.fill = '#fff';
          text.size = radius * ratios.textSize;

          group.add(arc, text);
        });

        group.translation.set(center.x, center.y);
        group.center();
        drawTicker();

        two.update();
      }

      function handleResize() {
        setViewBox(two.width, two.height);
        drawWheel();
        drawTicker();
        two.update();
      }

      function handleCursorDown(e) {
        const event = getEvent(e);
        const groupElem = group._renderer.elem;
        isGroupActive = groupElem === e.target || groupElem.contains(e.target);
        curPosArr = isGroupActive ? curPosArr.concat(getEventPos(e)) : curPosArr;
        lastCurTime = performance.now();
      }

      function handleCursorMove(e) {
        if (isGroupActive && curPosArr.length) {
          e.preventDefault();
          lastCurTime = performance.now();
          curPosArr = curPosArr.concat(getEventPos(e));
          const currPos = curPosArr[curPosArr.length - 1];
          const prevPos = curPosArr[curPosArr.length - 2];
          const groupBounds = group._renderer.elem.getBoundingClientRect();
          const groupCenter = {
            x: groupBounds.left + groupBounds.width / 2,
            y: groupBounds.top + groupBounds.height / 2,
          };
          const angleAtCursorDown = Math.atan2(
            prevPos.y - groupCenter.y,
            prevPos.x - groupCenter.x
          );
          const angleAtCursorNow = Math.atan2(
            currPos.y - groupCenter.y,
            currPos.x - groupCenter.x
          );
          const deltaRotation = angleAtCursorNow - angleAtCursorDown;
          dirScalar = deltaRotation > 0 ? 1 : -1;

          group.rotation = (group.rotation + deltaRotation) % TAU;

          handleRotationChange(group.rotation);

          two.update();
        }
      }

      function handleCursorUp(e) {
        if (isGroupActive && curPosArr.length > 1) {
          const currPos = getEventPos(e);
          const lastPos = curPosArr[curPosArr.length - 2];
          const timeNow = performance.now();
          const time = timeNow - lastCurTime;
          const distance = Math.sqrt(
            Math.pow(currPos.x - lastPos.x, 2) +
            Math.pow(currPos.y - lastPos.y, 2)
          );
          speed = Math.min(distance / time, maxSpeed);

          two.bind('update', animateWheel);
        }

        curPosArr = [];
        isGroupActive = false;
      }

      function getEventPos(e) {
        const event = getEvent(e);

        return {
          x: event.clientX,
          y: event.clientY,
        };
      }

      function getEvent(e) {
        return e.changedTouches ? e.changedTouches[0] : e;
      }

      function animateWheel() {
        group.rotation = (group.rotation + speed * dirScalar) % TAU;
        speed = speed * friction;

        handleRotationChange(group.rotation);

        if (speed < 0.005) {
          two.unbind('update', animateWheel);
        }
      }

      function handleRotationChange(angle) {
        if (options.onWheelTick && typeof options.onWheelTick === 'function') {
          options.onWheelTick(angle);
        }
      }

      function spin(newSpeed) {
        speed = newSpeed;
        two.bind('update', animateWheel);
      }

      function updateDims({ height, width }) {
        two.width = parseInt(width, 10);
        two.height = parseInt(height, 10);
        two.trigger('resize');
      }

      function getCurrentWord() {
        const numWords = words.length;
        const segmentAngle = TAU / numWords;
        const currAngle = (TAU - group.rotation + segmentAngle / 2) % TAU;

        return words.find((_, i) => segmentAngle * (i + 1) > currAngle);
      }

      function initEvents() {
        const domElement = two.renderer.domElement;

        Object.keys(eventMap).map(type =>
          domElement.addEventListener(type, eventMap[type])
        );
      }

      function removeEvents() {
        const domElement = two.renderer.domElement;

        two.unbind('update');

        Object.keys(eventMap).map(type =>
          domElement.removeEventListener(type, eventMap[type])
        );
      }

      function destroyPaths() {
        group.remove.apply(group, group.children);
        two.clear();
      }

      function destroy() {
        destroyPaths();
        removeEvents();

        return true;
      }

      return {
        destroy,
        drawWheel,
        getCurrentWord,
        init,
        setWords,
        spin,
        updateDims,
      };
    };

    const mount = document.querySelector('.js-mount');
    const wordButton = document.querySelector('.js-get-word');
    const spinButton = document.querySelector('.js-spin');
    const wordsInput = document.querySelector('.js-words');
    const getWords = () => vm.engineersNames;

    //wordsInput.addEventListener('input', handleChange);
    //wordButton.addEventListener('click', handleGetWord);
    //spinButton.addEventListener('click', handleSpin);

    const wheel = wheelFactory(mount);
    wheel.init({
      width: Math.min(window.innerWidth, window.innerHeight),
      height: Math.min(window.innerWidth, window.innerHeight),
      onWheelTick: () => console.log('tick'),
    });
    wheel.setWords(getWords());
    wheel.drawWheel();

    function handleChange() {


      wheel.setWords(vm.engineersNames);
      wheel.drawWheel();
    }

    function handleGetWord(e) {
      const word = wheel.getCurrentWord();

      e.target.textContent = `Get current word: ${word}`;
    }

    function handleSpin() {
      wheel.spin(Math.random());
    }

    window.addEventListener('resize', () => {
      wheel.updateDims({
        width: Math.min(window.innerWidth, window.innerHeight),
        height: Math.min(window.innerWidth, window.innerHeight),
      });
    });

  }
})();

