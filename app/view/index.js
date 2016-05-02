'use strict';

const $ = require('jquery');
const service = require('./../core/service');
const SlideRenderer = require('./../core/paint').SlideRenderer;
let docPanel = require('./docPanel.js');
let thumbnailPanel = require('./thumbnailPanel.js');
let currentDoc;
let currentSlideIndex;
let renderer = new SlideRenderer();

function init() {
  $(window).bind('hashchange', onHashChange);
  docPanel.init();

  $(document).ready(onPageReady);
}

function onPageReady() {
  updateLayout();
  window.onresize = function () {
    updateLayout();
  };
  $('html').keydown(function (event) {
    // F5
    if (event.keyCode === 116) {
      $('#board').addClass('fullscreen');
    }
    // Esc
    if (event.keyCode === 27) {
      $('#board').removeClass('fullscreen');
    }
    // LeftArrow, UpArrow, PgUp
    if (event.keyCode === 37 || event.keyCode === 38 || event.keyCode === 33) {
      setSlideIndex(currentSlideIndex - 1);
    }
    // RightArrow, DownArrow, PgDn
    if (event.keyCode === 39 || event.keyCode === 40 || event.keyCode === 34) {
      setSlideIndex(currentSlideIndex + 1);
    }
  });
  onHashChange();
}

function updateLayout() {
  var workspace = $('#workspace');
  $('#board-container').stop().animate({
    width: workspace.width(),
    height: workspace.height()
  }, 120);

  var $thumbnails = $('#thumbnails');
  $('#thumbnails').height($thumbnails.parent().height());
}

function onHashChange() {
  let anchor = $.uriAnchor.makeAnchorMap();
  if (anchor.did && (!currentDoc || currentDoc.id !== anchor.did)) {
    service.getDoc(anchor.did).then(doc => {
      setDoc(doc);
    });
  }
  if (currentDoc && anchor.slide && anchor.slide !== currentSlideIndex) {
    setSlideIndex(anchor.slide - 1);
  }
}

function setDoc(doc) {
  currentDoc = doc;
  thumbnailPanel.render(doc.slides, renderer);
  setSlideIndex(0);
}

function setSlideIndex(index) {
  if (currentDoc && currentDoc.slides.length > index && index >= 0) {
    currentSlideIndex = index;
    renderer.render(currentDoc.slides[index], '#board');
    $('#thumbnails li').removeClass('active');
    $(`#thumbnails li:nth-child(${index + 1})`).addClass('active');
  }
}


exports.init = init;