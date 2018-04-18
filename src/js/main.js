let Sharer = {
  STYLE: '{style}',
  CONST: {
    EMAIL_SUBJECT: 'I thought you might like this',
    ATTRIBUTE: {
      COMPONENT: 'data-share',
      URL: 'data-share-url',
      TITLE: 'data-share-title',
      TEXT: 'data-share-text',
      SUBJECT: 'data-share-subject'
    },
    CSS_ID: 'share_css',
    SOCIAL: {
      FACEBOOK: {
        id: 'facebook',
        icon: 'icons8-facebook-logo',
        color: '#3B5998',
        url: 'https://www.facebook.com/sharer.php?u={url}'
      },
      TWITTER: {
        id: 'twitter',
        icon: 'icons8-twitter',
        color: '#00aced',
        url: 'https://twitter.com/share?url={url}&text={text}'
      },
      PINTEREST: {
        id: 'pinterest',
        icon: 'icons8-pinterest-filled',
        color: '#bd081c',
        url: `
        javascript:void((function()%7Bvar%20e=document.createElement('script');e.setAttribute('type','text/javascript');e.setAttribute('charset','UTF-8');e.setAttribute('src','https://assets.pinterest.com/js/pinmarklet.js?r='+Math.random()*99999999);document.body.appendChild(e)%7D)());
        `
      },
      LINKEDIN: {
        id: 'linkedin',
        icon: 'icons8-linkedin-2-filled',
        color: '#007bb5',
        url: 'https://www.linkedin.com/shareArticle?mini=true&url={url}'
      },
      GOOGLE_PLUS: {
        id: 'googleplus',
        title: 'google+',
        icon: 'icons8-google-plus',
        color: '#db4437',
        url: 'https://plus.google.com/share?url={url}&text={text}'
      },
      EMAIL: {
        id: 'email',
        icon: 'icons8-email-envelope',
        color: '#03a5f0',
        url: 'mailto:?Subject={subject}&Body={body}'
      },
      WHATSAPP: {
        id: 'whatsapp',
        icon: 'icons8-whatsapp',
        color: '#25d366',
        url: 'whatsapp://send?text={url}'
      }
    },
    TEMPLATE: `
    <a href="{url}" target="_blank">
    <div class="icon {icon}"></div>
    <span>{title}</span>
    </a>
    `
  },
  elementCollection: [],
  init() {
    document.addEventListener('DOMContentLoaded', this.onLoaded.bind(this));
  },
  onLoaded() {
    this.addCSS();
    this.getShareItems();
  },
  addCSS() {
    var head = document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';
    if (style.styleSheet) {
      style.styleSheet.cssText = this.STYLE;
    } else {
      style.appendChild(document.createTextNode(this.STYLE));
    }

    head.appendChild(style);
  },
  loadCSS() {
    if (!document.getElementById(this.CONST.CSS_ID)) {
      var head = document.getElementsByTagName('head')[0];
      var link = document.createElement('link');
      link.id = this.CONST.CSS_ID;
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = 'css/main.css';
      link.media = 'all';
      head.appendChild(link);
    }
  },
  getShareItems() {
    this.elementCollection = document.querySelectorAll('[' + this.CONST.ATTRIBUTE.COMPONENT + ']');
    for (let a = 0; a < this.elementCollection.length; ++a) {
      let element = this.elementCollection[a];
      this.setShareButton(element);
    }
  },
  setShareButton(element) {
    let socialId = element.getAttribute(this.CONST.ATTRIBUTE.COMPONENT);
    let shareurl = element.getAttribute(this.CONST.ATTRIBUTE.URL);
    let text = element.getAttribute(this.CONST.ATTRIBUTE.TEXT);
    let showTitle = element.getAttribute(this.CONST.ATTRIBUTE.TITLE);
    let socialItem = this.getSocialByKey(socialId);
    if (socialItem) {

      let url = this.setURL(socialItem, shareurl, text, element);
      let template = this.CONST.TEMPLATE;
      template = template.replace(/\{url\}/g, url);
      template = template.replace(/\{icon\}/g, socialItem.icon);
      let title = socialItem.title ? socialItem.title : socialItem.id;
      template = template.replace(/\{alt\}/g, title);
      if (!showTitle) title = '';
      template = template.replace(/\{title\}/g, title);
      element.innerHTML = template;
      element.style.backgroundColor = socialItem.color;
      if (showTitle) element.querySelector('span').classList.add('show');
    }
  },
  setURL(socialItem, shareurl, text, element) {
    let subject = element.getAttribute(this.CONST.ATTRIBUTE.SUBJECT);
    if (socialItem.id == 'email' && !subject) {
      subject = document.title ? document.title : this.CONST.EMAIL_SUBJECT;
    }
    let url = socialItem.url ? socialItem.url.replace(/\{url\}/g, shareurl) : '';
    url = url.replace(/\{text\}/g, text ? text : '');
    url = url.replace(/\{subject\}/g, subject ? subject : '');
    url = url.replace(/\{body\}/g, text ? text + '%0D%0A' + shareurl : shareurl);
    return url;
  },
  getSocialByKey(socialId) {
    for (let key in this.CONST.SOCIAL) {
      if (this.CONST.SOCIAL[key].id == socialId) return this.CONST.SOCIAL[key];
    }
  }
};

Sharer.init();
window.Sharer = Sharer;
