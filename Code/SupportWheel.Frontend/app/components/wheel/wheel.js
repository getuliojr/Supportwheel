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
      'shared.services.factory.handleException',
       'shared.services.service.schedule',
      'shared.services.service.notification'
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
  WheelController.$inject = ['handleExceptionFactory', 'engineerService', 'scheduleService', 'notificationService', '$scope'];


   /**
   * @ngdoc controller
   * @name components.wheel.controller:WheelController
   * @description
   *
   * It has the logic behind the component
   *
   */
  function WheelController(handleExceptionFactory, engineerService, scheduleService, notificationService, $scope) {
    var vm = this;
    vm.engineersNames = [];
    vm.engineers = [];
    //Engineer that have been drafted, so the wheel knows when and where to stop
    vm.draftEngineer = {};


    //Init component
    vm.$onInit = init;
    vm.startSpinning = handleSpin;

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
            for (var d = 0; d < data.length; d++) {
              vm.engineersNames.push(data[d].strNameEngineer);
            }
            handleChange();

            
          })
          .catch(handleExceptionFactory);

        //Get information about last draft
        scheduleService.load({ intPageSize: 1, intPageNumber: 1 }).then(function (data) {
          var i = 0;
          //Try to get the last date and period from the database
          if (data.length > 0) {
            vm.lastDate = data[0].dteSchedule;
            vm.lastPeriod = data[0].intPeriod;
            vm.lastEngineer = data[0].strNameEngineer;
            vm.lastDraftBy = data[0].strFullNameCreated;
          } else {
            vm.lastDate = new Date();
            vm.lastPeriod = 1;

          }
        });
      }


      //Listen for changes on instituição
      var engineerEvent = engineerService.listenEvent.both.all(loadEngineers);

      //Cleanup events when controller is destroyed
      $scope.$on("$destroy", engineerEvent);

      loadEngineers();
    }

    function addExtraSpin() {
      //Getting here means there is a new engineer drafted, so calculate how many more spins is required do stop in this name
      var originalRotation = angular.copy(group.rotation);
      var originalSpeed = angular.copy(speed);

      while (speed > 0.005) {
        group.rotation = (group.rotation + speed * dirScalar) % TAU;
        speed = speed * friction;
      }

     //reset speed to the original one to add an extra punch to stop in the right place
      speed = angular.copy(originalSpeed);

      //Compare result of the wheel with the desired solution
      while (getCurrentWord() != vm.draftEngineer.strNameEngineer) {
        console.log(getCurrentWord());
        speed = speed * (speed / (speed * friction));
        group.rotation = (group.rotation + speed * dirScalar) % TAU;
      }

      //reset rotation of the wheel to the original position, so it goes smooth
      group.rotation = originalRotation;
    }

    function startSpinning() {
      vm.spinning = true;
      vm.draftEngineer = {};
      two.bind('update', animateWheel);

      //Get a result from the server
      scheduleService.save({ dteSchedule: vm.lastDate, intPeriod: vm.lastPeriod }).then(function (result) {
        vm.draftEngineer = result;
        //add right speed to the wheel for this result
        addExtraSpin();
      }, handleExceptionFactory);
    }

    function animateWheel() {

      group.rotation = (group.rotation + speed * dirScalar) % TAU;
      if (speed <= 0.4) {
        //have to add speed to stop in the right one
        if (vm.draftEngineer.strNameEngineer !== undefined) {
          speed = speed * friction;
        }
      } else {
        //keep slowing down
        speed = speed * friction;
      }
      handleRotationChange(group.rotation);

      //Unbind events so the wheel stops
      if (speed < 0.005) {
        vm.spinning = false;
        two.unbind('update', animateWheel);
        //Show values in the screen
        vm.lastDate = vm.draftEngineer.dteSchedule;
        vm.lastPeriod = vm.draftEngineer.intPeriod;
        vm.lastEngineer = vm.draftEngineer.strNameEngineer;
        vm.lastDraftBy = vm.draftEngineer.strFullNameCreated;
        $scope.$apply();
        //Send a success message
        notificationService.show('success', "WHEEL.SUCCESS-SAVED");
      }
    }


    function handleRotationChange(angle) {
      if (options.onWheelTick && typeof options.onWheelTick === 'function') {
        options.onWheelTick(angle);
      }
    }
    
   //Colors to be used to fill the wheel
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
      '#3cb878',
      '#ee1c24',
      '#f6989d',
      '#00aef0',
      '#f26522',
      '#fff200',
      '#e70697',
      '#000000'
    ];

    //Wheel Font Base:  https://codepen.io/larrybotha/pen/yMmQyG
    const PI = Math.PI;
    const TAU = PI * 2;

    const degToRad = (deg) =>
      deg / 180 * PI;

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

    const getCoordOnCircle = (r, angleInRad, { cx, cy }) => {
      return {
        x: cx + r * Math.cos(angleInRad),
        y: cy + r * Math.sin(angleInRad),
      };
    };

    const friction = .99;
    const maxSpeed = .5;

    let group;
    let speed;
    let dirScalar = 1;
    let words;
    let two;
    let isGroupActive = false;
    let textDistFromEdge = 30;
    let curPosArr = [];
    let lastCurTime;

    
    let options = {
      width: 240,
      height: 240,
      type: 'svg',
    };

    
    

    

    function getCurrentWord() {
      const numWords = words.length;
      const segmentAngle = TAU / numWords;
      const currAngle = (TAU - group.rotation + segmentAngle / 2) % TAU;

      return words.find((_, i) => segmentAngle * (i + 1) > currAngle);
    }

    function handleCursorDown(e) {
      const event = getEvent(e);
      const groupElem = group._renderer.elem;
      isGroupActive = groupElem === e.target || groupElem.contains(e.target);
      curPosArr = isGroupActive ? curPosArr.concat(getEventPos(e)) : curPosArr;
      lastCurTime = performance.now();
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

      path.fill = "#3f51b5"

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

        startSpinning();

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




    function spin(newSpeed) {
      speed = newSpeed;
      startSpinning();

    }

    function updateDims({ height, width }) {
      two.width = parseInt(width, 10);
      two.height = parseInt(height, 10);
      two.trigger('resize');
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

    const wheelFactory = (mountElem) => {
      if (!mountElem || !('nodeType' in mountElem)) {
        throw new Error('no mount element provided');
      }

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
      var randomSpeed = 0;
      while (randomSpeed < 0.4) {
        randomSpeed = Math.random();
      }
      wheel.spin(randomSpeed);
    }

    window.addEventListener('resize', () => {
      wheel.updateDims({
        width: Math.min(window.innerWidth, window.innerHeight),
        height: Math.min(window.innerWidth, window.innerHeight),
      });
    });

  }
})();

