/*! * MainApp v1.0.0  */
var MainApp = (function ( win, doc) {
    "use strict";
    var MainApp = { 
        AppInfo: { 
            name: "MainApp", version: "1.0.0", author: "Themeyn" 
        }, 
        Package: { 
            name: "Scribbler", version: "1.0", 
        } 
    }

    function docReady(callback){
        document.addEventListener('DOMContentLoaded', callback, false);
    }
    
    function winLoad(callback){
        window.addEventListener('load', callback, false);
    }
    
    function onResize(callback,selector){
        selector = (typeof selector === typeof undefined) ? window : selector;
        selector.addEventListener('resize', callback)
    }
    
    MainApp.docReady = docReady;
    MainApp.winLoad = winLoad;
    MainApp.onResize = onResize;

    return MainApp;
}(window, document));

MainApp = function (MainApp) {
    "use strict";

    // Global Uses @v1.0
    /////////////////////////////
    MainApp.BS = {};
    MainApp.Addons = {};
    MainApp.Custom = {};
    MainApp.Chart = {};
    MainApp.body = document.querySelector('body');
    MainApp.Win = { height: window.innerHeight, width: window.innerWidth };
    MainApp.Break = { xs: 480, sm: 640, md: 768, lg: 1024, xl: 1140, xl2: 1280, any: Infinity };
    
    // State @v1.0
    MainApp.State = {
        isRTL: (MainApp.body.classList.contains('rtl') || MainApp.body.getAttribute('dir') === 'rtl') ? true : false,
        isTouch: (("ontouchstart" in document.documentElement)) ? true : false,
        isMobile: (navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone|/i)) ? true : false,
        asMobile: (MainApp.Win.width < MainApp.Break.md) ? true : false
    };

    // State Update @v1.1
    MainApp.StateUpdate = function () {
        MainApp.Win = { height: window.innerHeight, width: window.innerWidth };
        MainApp.State.asMobile = (MainApp.Win.width < MainApp.Break.md) ? true : false;
    };

    // attribute maker
    MainApp.attr = function(selector,property,value) {
        const att = document.createAttribute(property);
            att.value = value;
            selector.setAttributeNode(att);
    }
    
    //slide up
    MainApp.SlideUp = function (target, duration=500) {
        target.style.transitionProperty = 'height, margin, padding';
        target.style.transitionDuration = duration + 'ms';
        target.style.boxSizing = 'border-box';
        target.style.height = target.offsetHeight + 'px';
        target.offsetHeight; target.style.overflow = 'hidden'; target.style.height = 0;
        target.style.paddingTop = 0; target.style.paddingBottom = 0;
        target.style.marginTop = 0; target.style.marginBottom = 0;
        window.setTimeout( () => {
            target.style.display = 'none';
            target.style.removeProperty('height');
            target.style.removeProperty('padding-top');
            target.style.removeProperty('padding-bottom');
            target.style.removeProperty('margin-top');
            target.style.removeProperty('margin-bottom');
            target.style.removeProperty('overflow');
            target.style.removeProperty('transition-duration');
            target.style.removeProperty('transition-property');
        }, duration);
    };

    //side down
    MainApp.SlideDown = function (target, duration=500) {
        target.style.removeProperty('display');
        let display = window.getComputedStyle(target).display;
        if (display === 'none') display = 'block';
        target.style.display = display;
        let height = target.offsetHeight; 
        target.style.overflow = 'hidden'; target.style.height = 0; target.style.paddingTop = 0;
        target.style.paddingBottom = 0; target.style.marginTop = 0;
        target.style.marginBottom = 0; target.offsetHeight;
        target.style.boxSizing = 'border-box';
        target.style.transitionProperty = "height, margin, padding";
        target.style.transitionDuration = duration + 'ms';
        target.style.height = height + 'px';
        target.style.removeProperty('padding-top'); target.style.removeProperty('padding-bottom');
        target.style.removeProperty('margin-top'); target.style.removeProperty('margin-bottom');
        window.setTimeout( () => {
          target.style.removeProperty('height');
          target.style.removeProperty('overflow');
          target.style.removeProperty('transition-duration');
          target.style.removeProperty('transition-property');
        }, duration);
    };

    //slide toggle
    MainApp.SlideToggle = function (target, duration=500) {
        if (window.getComputedStyle(target).display === 'none') {
            return MainApp.SlideDown(target, duration);
          } else {
            return MainApp.SlideUp(target, duration);
        }
    };

    //get parent Elements
    MainApp.getParents = function(el, selector, filter) {
        // If no selector defined will bubble up all the way to *document*
        let parentSelector = (selector === undefined) ? document : document.querySelector(selector);
        var parents = [];
        var pNode = el.parentNode;
        
        while (pNode !== parentSelector) {
            var element = pNode;

            if(filter === undefined){
                parents.push(element); // Push that parentSelector you wanted to stop at
            }else{
                element.classList.contains(filter) && parents.push(element);
            }
            pNode = element.parentNode;
        }
        
        return parents;
    }

    /*! Toggle Class */
    MainApp.ToggleClass = function(el){
        const elm = document.querySelectorAll('.class-toggle');
        elm.forEach(function(item){
            let target = document.querySelector(item.dataset.target);
            let activeclass = item.dataset.activeClass ? item.dataset.activeClass : 'active';
            let bodyScroll = item.dataset.bodyScroll === "off" ? true : false;
            item.addEventListener("click", function(e){
                let items = document.querySelectorAll(`[data-target="${item.dataset.target}"]`);
                items.forEach(function(single){
                    single.classList.contains(activeclass) ? single.classList.remove(activeclass) : single.classList.add(activeclass);
                })
                target.classList.contains(activeclass) ? target.classList.remove(activeclass) : target.classList.add(activeclass);
                bodyScroll && document.body.classList.toggle('overflow-hidden');
            })
        })
    }

    /*! Dropdown 
    // add 'clickable' class with dropdown-menu to stop auto close
    */
   MainApp.Dropdown = function(el){
       const elm = document.querySelectorAll('.dropdown-toggle');
       elm.forEach(function(item){
           item.addEventListener("click", function(e){
               e.preventDefault();
                const offset = item.dataset.offset ? [parseInt(item.dataset.offset.split(',')[0]), parseInt(item.dataset.offset.split(',')[1])] : [0, 0];
                const rtlOffset = item.dataset.rtlOffset ? [parseInt(item.dataset.rtlOffset.split(',')[0]), parseInt(item.dataset.rtlOffset.split(',')[1])] : offset;
                let placement = item.dataset.placement ? item.dataset.placement : 'bottom-start';
                let rtlPlacement = item.dataset.rtlPlacement ? item.dataset.rtlPlacement : 'bottom-end';

                 var getNextSibling = function (elem, selector) {

                    var sibling = elem.nextElementSibling;
            
                    while (sibling) {
                        if (sibling.matches(selector)) return sibling;
                        sibling = sibling.nextElementSibling
                    }
                
                };
                Popper.createPopper(item, getNextSibling(item, '.dropdown-menu'), {
                    placement : MainApp.State.isRTL ? rtlPlacement :placement,
                    // strategy: 'fixed',
                    modifiers: [
                        {
                          name: 'offset',
                          options: {
                            offset: MainApp.State.isRTL ? rtlOffset : offset,
                          },
                        },
                        {
                            name: 'preventOverflow',
                            options: {
                              padding: 8,
                              altAxis: true,
                              boundary: '#pagecontent',
                            },
                        },
                    ],
                });
                item.classList.contains("show") ? item.classList.remove("show") : item.classList.add("show");
            })
            document.addEventListener("mouseup", function(e){
                e.preventDefault();
                if(item !== e.target && MainApp.getParents(e.target,undefined, 'clickable').length <= 0 && !e.target.classList.contains('clickable')){
                    item.classList.remove("show");
                }
            })
        })
    }

    /*! Accordion 
    // add 'manual-close' class with accordion (main wrapper) to stop auto close
    */
    MainApp.Accordion = function(el){
        const elm = document.querySelectorAll('.accordion-toggle');
        elm.forEach(function(item){
            let parent = item.parentElement, 
                accordion_body = item.nextElementSibling, 
                accordion_root = parent.parentElement, 
                accordion_items = accordion_root.children, 
                speed = 400;

            //on load
            parent.classList.contains("active") ? accordion_body.style.display = 'block' : accordion_body.style.display = 'none';
            
            item.addEventListener("click", function(e){
                e.preventDefault();
                Array.from(accordion_items).forEach(item => {
                    if(item !== parent && !accordion_root.classList.contains('manual-close')){
                        MainApp.SlideUp(item.querySelector('.accordion-body'),speed);
                        item.classList.remove("active");
                    }
                });
                if(!parent.classList.contains("active")){
                    parent.classList.add("active");
                    MainApp.SlideDown(accordion_body,speed);
                }else{
                    MainApp.SlideUp(accordion_body,speed);
                    parent.classList.remove("active");
                }
            })
        })
    }

    /*! Modal */
    MainApp.Modal = function(el){
        const elm = document.querySelectorAll('.modal-toggle');
        elm.forEach(function(item){
            let dialog = document.querySelector(item.dataset.target),
                close = dialog?.querySelectorAll('.modal-close'),
                getAll = document.querySelectorAll('.modal');
            item.addEventListener("click", function(e){
                dialog.classList.add('show');
                document.body.classList.add('overflow-hidden');
                getAll.forEach(function(getItem){
                    getItem !== dialog && getItem.classList.remove('show');
                })
            })
            close?.forEach(function(item){
                item.addEventListener("click", function(e){
                    e.preventDefault();
                    dialog.classList.remove('show');
                    document.body.classList.remove('overflow-hidden');
                })
            })
        })
    }

    /*! Tab */
    MainApp.Tab = function(el){
        const elm = document.querySelectorAll('.tab-toggle');
        const urlParams = new URLSearchParams(window.location.search);
        const myParam = urlParams.get('tab');
        elm.forEach(function(item){
            let panel = document.querySelector(item.dataset.target),
                panel_root = panel.parentElement,
                panel_items = panel_root.children;

            if(myParam != null && item.dataset.target.slice(1) == myParam){
                let toggles = item.closest('.tab-nav').querySelectorAll('.tab-toggle');
                Array.from(toggles).forEach(item => {
                    item.classList.remove('active');
                });
                item.classList.add('active');

                //tab panel active
                Array.from(panel_items).forEach(item => {
                    item.classList.remove('active');
                });
                panel.classList.add('active');
            }
                
            item.addEventListener("click", function(e){
                e.preventDefault();
                // tab toggle active
                let toggles = item.closest('.tab-nav').querySelectorAll('.tab-toggle');
                Array.from(toggles).forEach(item => {
                    item.classList.remove('active');
                });
                item.classList.add('active');

                //tab panel active
                Array.from(panel_items).forEach(item => {
                    item.classList.remove('active');
                });
                panel.classList.add('active');
            })
        })
    }

    //Extend Object
    MainApp.extendObject = function(obj, ext) {
        Object.keys(ext).forEach(function (key) { obj[key] = ext[key]; });
        return obj;
    }

    ///////////////////////////////
    // Initial by default
    /////////////////////////////
    MainApp.onResize(MainApp.StateUpdate);

    MainApp.init = function(){
        MainApp.ToggleClass();
        MainApp.Dropdown();
        MainApp.Accordion();
        MainApp.Modal();
        MainApp.Tab();
    }

    MainApp.init();

    return MainApp;
}(MainApp);