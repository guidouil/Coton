import { Template } from 'meteor/templating';

import './syllabes_template.html';

Template.syllabes.onCreated(function () {
  this.leftParts = [
    'b', 'c', 'd', 'f', 'g', 'j', 'k', 'l', 'm', 'n', 'p', 'qu',
    'r', 's', 't', 'v', 'x', 'ch', 'br', 'bl', 'cr', 'tr',
  ];
  this.rightParts = [
    'a', 'e', 'i', 'o', 'u', 'an', 'au', 'ai',
    'en', 'é', 'eu', 'è', 'in', 'on', 'ou', 'oi',
  ];
  this.color = [
    'red', 'orange', 'yellow', 'olive', 'green', 'teal', 'none',
    'blue', 'violet', 'purple', 'pink', 'brown', 'grey', 'black',
  ];
});

Template.syllabes.onRendered(function () {
  Session.set('majuscule', true);
  Session.set('cursive', false);
  Session.set('left', _.sample(Template.instance().leftParts));
  Session.set('right', _.sample(Template.instance().rightParts));
  Session.set('colorLeft', _.sample(Template.instance().color));
  Session.set('colorRight', _.sample(Template.instance().color));
  // $('select').dropdown();
});

Template.syllabes.helpers({
  left () {
    return Session.get('left');
  },
  right () {
    return Session.get('right');
  },
  leftChoice () {
    return Template.instance().leftParts;
  },
  rightChoice () {
    return Template.instance().rightParts;
  },
  uppercase (string) {
    if (string) {
      return string.toUpperCase();
    }
  },
  colorLeft () {
    return Session.get('colorLeft');
  },
  colorRight () {
    return Session.get('colorRight');
  },
  isMajuscules (text, position) {
    if (text && Session.equals('majuscule', true)) {
      return text.toUpperCase();
    }
    if (text && position === 'left' && Session.equals('cursive', true) && Math.random() > 0.5) {
      return text.charAt(0).toUpperCase() + text.slice(1);
    }
    return text;
  },
  hasCursiveClass () {
    if (Session.equals('cursive', true)) {
      return 'cursive';
    }
    return false;
  },
});

Template.syllabes.events({
  'click .reload' () {
    if (Session.equals('needReload', true)) {
      Session.set('needReload', false);
      Meteor._reload.reload();
    } else {
      Session.set('left', _.sample(Template.instance().leftParts));
      Session.set('right', _.sample(Template.instance().rightParts));
      Session.set('colorLeft', _.sample(Template.instance().color));
      Session.set('colorRight', _.sample(Template.instance().color));
    }
  },
  'click .lire' () {
    let left = $('.leftPart').html();
    let right = $('.rightPart').html();
    let syllabe = new SpeechSynthesisUtterance();
    syllabe.lang = 'fr-FR';
    syllabe.text = ' ' + left.toUpperCase() + right.toUpperCase() + ' ';
    speechSynthesis.speak(syllabe);
  },
  'change #leftChoice' (evt) {
    let left = $(evt.target).val();
    if (left) {
      Session.set('left', $(evt.target).val());
      Session.set('colorLeft', _.sample(Template.instance().color));
    }
    Session.set('needReload', true);
  },
  'change #rightChoice' (evt) {
    let right = $(evt.target).val();
    if (right) {
      Session.set('right', $(evt.target).val());
      Session.set('colorRight', _.sample(Template.instance().color));
    }
    Session.set('needReload', true);
  },
  'click .majuscule' () {
    $('.minuscule').removeClass('active');
    $('.majuscule').addClass('active');
    $('.cursive').removeClass('active');
    Session.set('majuscule', true);
    Session.set('cursive', false);
  },
  'click .minuscule' () {
    $('.minuscule').addClass('active');
    $('.majuscule').removeClass('active');
    $('.cursive').removeClass('active');
    Session.set('majuscule', false);
    Session.set('cursive', false);
  },
  'click .cursive' () {
    $('.cursive').addClass('active');
    $('.minuscule').removeClass('active');
    $('.majuscule').removeClass('active');
    Session.set('cursive', true);
    Session.set('majuscule', false);
  },
  'click .leftDown' () {
    let nextElement = $('#leftChoice > option:selected').next('option');
    if (nextElement.length > 0) {
      $('#leftChoice > option:selected').removeAttr('selected').next('option').attr('selected', 'selected');
      Session.set('left', $('#leftChoice > option:selected').val());
      Session.set('colorLeft', _.sample(Template.instance().color));
    }
  },
  'click .rightDown' () {
    let nextElement = $('#rightChoice > option:selected').next('option');
    if (nextElement.length > 0) {
      $('#rightChoice > option:selected').removeAttr('selected').next('option').attr('selected', 'selected');
      Session.set('right', $('#rightChoice > option:selected').val());
      Session.set('colorRight', _.sample(Template.instance().color));
    }
  },
  'click .bugButton' () {
    Meteor._reload.reload();
  },
});
