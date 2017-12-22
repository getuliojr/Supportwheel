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
      'shared.services.service.notification',
     'shared.services.value.varantes'

    ])


    /**
    * @ngdoc directive
    * @name components.wheel.directive:swWheel
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
  WheelController.$inject = ['handleExceptionFactory', 'engineerService', 'scheduleService', 'notificationService', '$scope', 'varEventosDb','$timeout'];


   /**
   * @ngdoc controller
   * @name components.wheel.controller:WheelController
   * @description
   *
   * It has the logic behind the component
   *
   */
  function WheelController(handleExceptionFactory, engineerService, scheduleService, notificationService, $scope, varEventosDb, $timeout) {
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
        * @methodOf  components.wheel.controller:WheelController
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

      //Listen for changes on schedule
      var scheduleEvent = scheduleService.listenEvent.hub.inserted(updateResult);

      //Cleanup events when controller is destroyed
      $scope.$on("$destroy", scheduleEvent);

      //Responsable to change the data entered and selected by the user already to a new culture set.
      function updateResult(result) {
        //Update content if outdated
        if (result.type = varEventosDb.INSERTED) {
          //Update Data
          var update = function (result) {
            if (result.data.dteSchedule >= vm.lastDate) {
              vm.lastDate = result.data.dteSchedule;
              vm.lastPeriod = result.data.intPeriod;
              vm.lastEngineer = result.data.strNameEngineer;
              vm.lastDraftBy = result.data.strFullNameCreated;
              $scope.$apply();
            }
          }

          //Wait 10 seconds to show result in the grid to keep suspense of the wheel
          $timeout(function () {
            update(result)
          }.bind(this), 14000);


          
        }
      }
    }

    /**
        * @ngdoc function
        * @name addExtraSpin
        * @methodOf  components.wheel.controller:WheelController
        * @private
        *
        * @description
        *
        * This is responsable to calculate how many more speed is required to make the wheel stop in the desired position
        * Since the result is calculated in the server, we just sync the frontend vision to make it appears everything happens here.
        */
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
        speed = speed * (speed / (speed * friction));
        group.rotation = (group.rotation + speed * dirScalar) % TAU;
      }

      //reset rotation of the wheel to the original position, so it goes smooth
      group.rotation = originalRotation;
    }

     /**
        * @ngdoc function
        * @name startSpinning
        * @methodOf  components.wheel.controller:WheelController
        * @private
        *
        * @description
        *
        * This has all the logic to start the wheel spinning
        */
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

     /**
        * @ngdoc function
        * @name animateWheel
        * @methodOf  components.wheel.controller:WheelController
        * @private
        *
        * @description
        *
        * Responsable to canculate speed and rotation of the draw
        */
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

 /**
        * @ngdoc function
        * @name handleRotationChange
        * @methodOf  components.wheel.controller:WheelController
        * @private
        *
        * @description
        *
        * Responsable to rotate the wheel
        */
    function handleRotationChange(angle) {
      if (options.onWheelTick && typeof options.onWheelTick === 'function') {
        options.onWheelTick(angle);
      }
    }
    
   //Colors to be used to fill the wheel
    var COLORS = [
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
    var PI = Math.PI;
    var TAU = PI * 2;

    var degToRad = function (deg) {
      return deg / 180 * PI;
    }

    var eventMap = {
      mousedown: handleCursorDown,
      touchstart: handleCursorDown,
      mousemove: handleCursorMove,
      touchmove: handleCursorMove,
      mouseup: handleCursorUp,
      touchend: handleCursorUp,
    };

    var ratios = {
      tickerRadius: .06, // of width
      textSize: .12, // of radius
      edgeDist: .14, // of radius
    };

    var getCoordOnCircle = (r, angleInRad, { cx, cy }) => {
      return {
        x: cx + r * Math.cos(angleInRad),
        y: cy + r * Math.sin(angleInRad),
      };
    };

    var friction = .99;
    var maxSpeed = .5;

    var group;
    var speed;
    var dirScalar = 1;
    var words;
    var two;
    var isGroupActive = false;
    var textDistFromEdge = 30;
    var curPosArr = [];
    var lastCurTime;

    
    var options = {
      width: 240,
      height: 240,
      type: 'svg',
    };

    
    

    

    function getCurrentWord() {
      var numWords = words.length;
      var segmentAngle = TAU / numWords;
      var currAngle = (TAU - group.rotation + segmentAngle / 2) % TAU;

      return words.find((_, i) => segmentAngle * (i + 1) > currAngle);
    }

    function handleCursorDown(e) {
      var event = getEvent(e);
      var groupElem = group._renderer.elem;
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
      var { width } = two;
      var outerRadius = ratios.tickerRadius * width;

      var tickerCircle = drawTickerCircle(outerRadius);
      var circleCenter = tickerCircle.translation;

      drawTickerArrow(outerRadius, degToRad(30), circleCenter);
    }

    function drawTickerCircle(outerRadius) {
      var { width } = two;
      var arc = two.makeArcSegment(
        width / 2, outerRadius,
        outerRadius, outerRadius * .5,
        0, 2 * PI
      );
      arc.noStroke();

      return arc;
    }



    function drawTickerArrow(radius, tangentAngle, tickerCenter) {
      var { x, y } = tickerCenter;

      var pointA = getCoordOnCircle(
        radius, PI / 2, { cx: x, cy: y }
      );
      var pointB = getCoordOnCircle(
        radius, tangentAngle, { cx: x, cy: y }
      );
      var pointC = {
        x: x,
        y: y + radius / Math.cos(PI / 2 - tangentAngle),
      };
      var pointD = getCoordOnCircle(
        radius, PI - tangentAngle, { cx: x, cy: y }
      );
      var path = two.makePath(
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

      var { width, height } = two;
      var numColors = COLORS.length;
      var rotationUnit = 2 * PI / words.length;
      var yOffset = width * ratios.tickerRadius * 2;
      var radius = (width - yOffset) / 2;
      var center = {
        x: width / 2,
        y: radius + yOffset,
      };
      group = two.makeGroup();

      words.map((word, i, arr) => {
        var angle = rotationUnit * i - (PI + rotationUnit) / 2;
        var arc = two.makeArcSegment(
          center.x, center.y,
          0, radius,
          0, 2 * PI / arr.length
        );
        arc.rotation = angle;
        arc.noStroke();
        arc.fill = COLORS[i % numColors];

        var textVertex = {
          x: center.x + (radius - radius * ratios.edgeDist) * Math.cos(angle + rotationUnit / 2),
          y: center.y + (radius - radius * ratios.edgeDist) * Math.sin(angle + rotationUnit / 2),
        };

        var text = two.makeText(word, textVertex.x, textVertex.y);
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
        var currPos = getEventPos(e);
        var lastPos = curPosArr[curPosArr.length - 2];
        var timeNow = performance.now();
        var time = timeNow - lastCurTime;
        var distance = Math.sqrt(
          Math.pow(currPos.x - lastPos.x, 2) +
          Math.pow(currPos.y - lastPos.y, 2)
        );
        speed = Math.min(distance / time, maxSpeed);

        if (speed < 0.4) {

          return;
        }
        startSpinning();

      }

      curPosArr = [];
      isGroupActive = false;
    }

    function getEventPos(e) {
      var event = getEvent(e);

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
        var currPos = curPosArr[curPosArr.length - 1];
        var prevPos = curPosArr[curPosArr.length - 2];
        var groupBounds = group._renderer.elem.getBoundingClientRect();
        var groupCenter = {
          x: groupBounds.left + groupBounds.width / 2,
          y: groupBounds.top + groupBounds.height / 2,
        };
        var angleAtCursorDown = Math.atan2(
          prevPos.y - groupCenter.y,
          prevPos.x - groupCenter.x
        );
        var angleAtCursorNow = Math.atan2(
          currPos.y - groupCenter.y,
          currPos.x - groupCenter.x
        );
        var deltaRotation = angleAtCursorNow - angleAtCursorDown;
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
      var domElement = two.renderer.domElement;

      Object.keys(eventMap).map(type =>
        domElement.addEventListener(type, eventMap[type])
      );
    }

    function removeEvents() {
      var domElement = two.renderer.domElement;

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

    var wheelFactory = (mountElem) => {
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

    var mount = document.querySelector('.js-mount');
    var wordButton = document.querySelector('.js-get-word');
    var spinButton = document.querySelector('.js-spin');
    var wordsInput = document.querySelector('.js-words');
    var getWords = () => vm.engineersNames;


    var wheel = wheelFactory(mount);
    wheel.init({
      width: Math.min(window.innerWidth, window.innerHeight),
      height: Math.min(window.innerWidth, window.innerHeight)
    });
    wheel.setWords(getWords());
    wheel.drawWheel();

    function handleChange() {


      wheel.setWords(vm.engineersNames);
      wheel.drawWheel();
    }

    function handleGetWord(e) {
      var word = wheel.getCurrentWord();

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

