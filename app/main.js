'use strict';

angular.module('ind-admin',['famous.angular','ui.router'])

    //********************************************************
	.controller('ctrl', function($scope,$famous){
		var Transitionable = $famous['famous/transitions/Transitionable'];
    	var Easing = $famous['famous/transitions/Easing'];
        var Engine = $famous['famous/core/Engine']
        
        var mainContext = Engine.createContext();
        
    
        //*********************TRANSITIONABLES************************
    
        //INTRO OBJECT TO HOLD ALL OF THE TRANSITIONS
    	$scope.intro = {
    		scale: new Transitionable([1,1,1]),
    		logoOpacity: new Transitionable(0),
    		sideOpacity: new Transitionable(0),
    		side: new Transitionable([0,0,0])
    	};
    
    
    
        //PAYOUT OBJECT
        var ss = mainContext._size;
        $scope.payout = {
            scale: new Transitionable([0,0,0]),
            opacity: new Transitionable(0),
            size: [ss[0] / 1.5,ss[1] / 1.145]
        }
        //************************************************************
        
        

    	//****************FADE IN LOGO AND MOVE HEADER
    	$scope.intro.logoOpacity.set(1,{curve:Easing.inOut,duration:2000})
        $scope.intro.scale.set([1.2,1.2,1.2],{curve:Easing.inOut})
        //************************************************************
        
        
    	//ANIMATE THE SCALE OF THE BAR AND EXTEND THE SIDEBAR ON MOUSEENTER EVENT
    	var closed = false;
    	$scope.close = function(){
    		if(!closed){
    			closed = true;
    			//$scope.intro.scale.set([1.2,1.2,1.2],{curve:Easing.inOut})
    			$scope.intro.side.set([300,0,0],{curve:Easing.inOut})
    		}
    	}

        //SIDEBAR OPTIONS **********************************************
    	$scope.optionPos = new Transitionable([-85,100,0])
        $scope.optionfuncs = [{name:'payout'},{name:'option 2'}, {name:'option 3'}]
    	$scope.options = []
        
        var counter = -.5;
        for(var i=0;i<=$scope.optionfuncs.length;i++){
            
            var pos = {
                func: $scope.optionfuncs[i],
                align: new Transitionable([counter,-.05]),
                size: new Transitionable([100,30])
            };
            $scope.options.push(pos);
            counter -= 1.5;
        }
    
        //MOUSEOVER CHANGE
        var expanded = false;
        var selected = false;
        
        var selected;
        $scope.slip = function(arg){
            console.log(this)
             var selection = arg;
             //SIDE SELECTION
             if(arg == 'payout'){
                 $scope.payout.scale.set([-500,1,1],{curve:Easing.inOut})
                 $scope.payout.opacity.set(1,{curbe:Easing.inOut})
             }
             var setter = this.$parent.$parent.option;
             var pos = this.$parent.$parent.option.align.state;
            
            //CANT SELECT THE OPTION TWICE
             if(selected == this){
                 return;
             }
            
            //LOOK FOR OTHER OPTIONS THAT ARE PUSHED OUT
            //RETURN THEM TO THEIR REGULAR STATE
            if(selected){
                var selected_pos = selected.$parent.$parent.option.align.state;
                //selected.$parent.$parent.option.align.set([selected_pos[0],selected_pos[1] + .1], {duration:100, curve:Easing.inOut});
                selected = this;
            }
            else{
                selected = this;
            }
            
           
            //GET SLIP OUT THE SELECTED OPTION
            $scope.intro.logoOpacity.set(0,{curve:Easing.inOut})
            //setter.position.set([pos[0] + 100,pos[1],pos[2]], {duration:100, curve:Easing.inOut})
            //setter.align.set([pos[0],pos[1] - .1],{curve:Easing.inOut})
        }
        
        //******************************************************************

	})
	.directive('logo',function($famous){
		return {
			restrict: 'EA',
			template: '<fa-modifier fa-opacity="intro.logoOpacity.get()" fa-origin="[.5,.5]" fa-align="[.5,.5]"><fa-image-surface fa-image-url="app/images/WhiteMaskLogoTransparent.png" fa-size="[500,500]"ng-mouseenter="close()"></fa-image-surface></fa-modifier>',
			link: function(scope){
                
            }
		}
	})
    .directive('sidebar',function($famous){
        return {
            restrict: 'EA',
            template: '<fa-modifier fa-align="[0,0]" fa-origin="[1,0]" fa-translate="intro.side.get()"><fa-surface fa-size="[300,undefined]" fa-background-color="\'black\'"><div style="color:white;padding:20px;font-size:2.5em">Admin Panel</div></fa-surface><fa-modifier ng-repeat="option in options" fa-translate="option.position.get()" fa-size="[300,70]" fa-rotate-z="option.rotate.get()"><fa-surface class="option" fa-background-color="\'black\'" fa-click="slip(option.func.name)"><center><a style="text-decoration:none"><div class=foo style="padding:20px"><p style="font-size:1.5em;color:white">{{option.name}}</p></div></a></center></fa-surface></fa-modifier></fa-modifier>'
        }
    })
    .directive('background', function($famous){
        return {
            restrict: 'EA',
            template: '<fa-modifier fa-origin="[.5,.5]" fa-align="[.5,.5]" fa-scale="intro.scale.get()" ><fa-surface fa-size="[undefined,500]" fa-background-color="\'#dc322f\'" ng-mouseenter="close()"></fa-surface></fa-modifier>'
        }
    })

 //ROUTER SECTION
    .config(function($stateProvider, $urlRouterProvider){
        $stateProvider
            .state("home", {
                url: "/",
                templateUrl: "main.html"
            })
            .state("payout", {
                url: "payout",
                templateUrl: "payout.html"
            })
        $urlRouterProvider.otherwise("/")
    })

