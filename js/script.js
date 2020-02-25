let msnry = new Masonry('.grid', {
  itemSelector: '.photo-item',
  columnWidth: '.grid__col-sizer',
  gutter: '.grid__gutter-sizer',
  percentPosition: true,
  stagger: 30,
  // nicer reveal transition
  visibleStyle: {
    transform: 'translateY(0)',
    opacity: 1
  },
  hiddenStyle: {
    transform: 'translateY(100px)',
    opacity: 0
  },
});

//------------------//

// Get an API key for your demos at https://unsplash.com/developers
let unsplashID = 'XNMHBANvtC9AdY6629KyMvqu0sYwzD83JqY1Azfw8TA';

let infScroll = new InfiniteScroll('.grid', {
  path: function () {
    return 'https://api.unsplash.com/photos?client_id=' +
      unsplashID + '&page=' + this.pageIndex;
  },
  // load response as flat text
  responseType: 'text',
  outlayer: msnry,
  status: '.page-load-status',
  history: false,
});

// use element to turn HTML string into elements
let proxyElem = document.createElement('div');

infScroll.on('load', function (response) {
  // parse response into JSON data
  let data = JSON.parse(response);
  // compile data into HTML
  let itemsHTML = data.map(getItemHTML).join('');
  // convert HTML string into elements
  proxyElem.innerHTML = itemsHTML;
  // append item elements
  let items = proxyElem.querySelectorAll('.photo-item');
  imagesLoaded(items, function () {
    infScroll.appendItems(items);
    msnry.appended(items);
  });
});

// load initial page
infScroll.loadNextPage();

//------------------//

let itemTemplateSrc = document.querySelector('#photo-item-template').innerHTML;

function getItemHTML(photo) {
  return microTemplate(itemTemplateSrc, photo);
}

// micro templating, sort-of
function microTemplate(src, data) {
  // replace {{tags}} in source
  return src.replace(/\{\{([\w\-_\.]+)\}\}/gi, function (match, key) {
    // walk through objects to get value
    let value = data;
    key.split('.').forEach(function (part) {
      value = value[part];
    });
    return value;
  });
}