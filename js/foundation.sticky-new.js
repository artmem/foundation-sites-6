!function($, Foundation){
  'use strict';
  function Sticky(element, options){
    this.$element = element;
    this.options = $.extend({}, Sticky.defaults, this.$element.data(), options || {});

    this._init();
  }
  Sticky.defaults = {
    stickToWindow: false,
    container: '<div data-sticky-container></div>',
    stickTo: 'top',
    stickAt: '',
    marginTop: 1,
    marginBottom: 1,
    stickyOn: 'medium',
    stickyClass: 'sticky',
    containerClass: 'sticky-container'
  };

  Sticky.prototype._init = function(){
    var $parent = this.$element.parent('[data-sticky-container]'),
        id = Foundation.GetYoDigits(6, 'sticky'),
        _this = this;

    this.$container = $parent.length ? $parent : $(this.options.container).wrapInner(this.$element).end();
    this.$container.addClass(this.options.containerClass);

    this.$anchor = this.options.stickAt ? $(this.options.stickAt) : $(document.body);

    this.$element.addClass(this.options.stickyClass).attr({'data-resize': id, 'data-scroll': id});

    this.isTop = this.options.stickTo === 'top';
    // console.log(this.$container.css('border-top-width'), $(document).height());
    this.$element.on('resizeme.zf.trigger', function(){
      console.log('something');
      _this._calc(true);
    });
    $(window).on('scroll', function(e){
      _this._calc(false, e.currentTarget.scrollY);
    });
    this._calc(true);
  };

  Sticky.prototype._calc = function(checkSizes, scroll){
    if(checkSizes){
      this._setSizes();
    }
    if(!scroll){ scroll = $(document.body).scrollTop(); }
    // var _this = this;
        // $body = $(document.body);
        // scroll = $body.scrollTop();
        // console.log(scroll);
    // if(this.options.stickTo === 'top'){
      if(scroll >= this.topPoint){
        if(scroll <= this.bottomPoint){
          this._setSticky();
          // console.log('should be stuck', scroll);
        }else{
          if(this.$element.hasClass('is-stuck')){
            this._removeSticky();
          }
        }
      }else{
        if(this.$element.hasClass('is-stuck')){
          this._removeSticky();
        }
      }
    // }else{
    //   if(scroll >= this.topPoint){
    //     if(scroll <= this.bottomPoint){
    //       this._setSticky();
    //     }else{
    //       if(this.$element.hasClass('is-stuck')){
    //         this._removeSticky();
    //       }
    //     }
    //   }else{
    //     if(this.$element.hasClass('is-stuck')){
    //       this._removeSticky();
    //     }
    //   }
    // }
  };
  Sticky.prototype._setSticky = function(){
    var stickTo = this.options.stickTo,
        mrgn = stickTo === 'top' ? 'marginTop' : 'marginBottom',
        notStuckTo = stickTo === 'top' ? 'bottom' : 'top',
        css = {};

    css[mrgn] = this.options[mrgn] + 'em';
    css[stickTo] = 0;
    css[notStuckTo] = 'auto';

    this.$element.removeClass('is-anchored')
                 .addClass('is-stuck is-at-' + stickTo)
                 .css(css);
  };

  // Sticky.prototype._setSticky = function(sticking){
  //   var stickTo = this.options.stickTo,
  //       isTop = stickTo === 'top',
  //       mrgn = isTop ? 'marginTop' : 'marginBottom',
  //       notStuckTo = isTop ? 'bottom' : 'top',
  //       css = {};
  //
  //   css[mrgn] = this.options[mrgn] + 'em';
  //   css[isTop ? stickTo : notStuckTo] = 0;
  //   css[isTop ? notStuckTo : stickTo] = 'auto';
  //
  //   this.$element.removeClass('is-anchored')
  //                .addClass('is-stuck is-at-' + stickTo)
  //                .css(css);
  // };
  Sticky.prototype._removeSticky = function(isBtmPt){
    var stickTo = this.options.stickTo,
        mrgn = stickTo === 'top' ? 'marginTop' : 'marginBottom',
        notStuckTo = stickTo === 'top' ? 'bottom' : 'top',
        css = {};
    // console.log(this.anchorHeight, 'bottompoint',this.bottomPoint);
    css[mrgn] = 0;
    css[stickTo] = this.anchorHeight - this.$element.height();
    css[notStuckTo] = 0;

    this.$element.removeClass('is-stuck is-at-' + stickTo)
                 .addClass('is-anchored is-at-' + notStuckTo)
                 .css(css);
  };

  Sticky.prototype._setSizes = function(cb){
    var _this = this,
        newElemWidth = this.$container[0].getBoundingClientRect().width,
        pdng = parseInt(window.getComputedStyle(this.$container[0])['padding-right'], 10);

    this.anchorHeight = this.$anchor[0].getBoundingClientRect().height;
    this.$element.css({
      'max-width': newElemWidth - pdng + 'px'
    });

    var newContainerHeight = this.$element[0].getBoundingClientRect().height;

    this.$container.css({
      height: newContainerHeight
    });
    this._setBreakPoints(newContainerHeight, function(){
      if(cb){ cb(); }
    });

  };
  Sticky.prototype._setBreakPoints = function(elemHeight, cb){
    var mTop = emCalc(this.options.marginTop),
        mBtm = emCalc(this.options.marginBottom),
        topPoint = this.$anchor.offset().top,
        bottomPoint = topPoint + this.$anchor[0].getBoundingClientRect().height,
        winHeight = window.innerHeight;
    if(this.options.stickTo === 'top'){
      topPoint -= mTop;
      bottomPoint -= this.$element[0].getBoundingClientRect().height + mTop;
    }else if(this.options.stickTo === 'bottom'){
      topPoint -= (winHeight - (elemHeight + mBtm));
      bottomPoint -= (winHeight - mBtm);
    }else{
      //this would be the stickTo: both option... tricky
    }

    this.topPoint = topPoint;
    this.bottomPoint = bottomPoint;

    cb();
  };

  function emCalc(em){
    return parseInt(window.getComputedStyle(document.body, null).fontSize, 10) * em;
  }
  Foundation.plugin(Sticky);
}(jQuery, window.Foundation);