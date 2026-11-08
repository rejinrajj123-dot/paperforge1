const blueprints = [
  // Fan creations — existing PDF files are preserved.
  { id: "luffy", name: "Luffy", category: "Hero", collection: "fan", desc: "A printable paper character blueprint.", difficulty: "Intermediate", time: "45–60 min", art: "luffy", pdf: "luffy.pdf" },
  { id: "golem", name: "Golem", category: "Minecraft Character", collection: "fan", desc: "A printable Minecraft Golem paper character blueprint.", difficulty: "Intermediate", time: "45–60 min", art: "golem", pdf: "golem.pdf" },

  // PaperForge Genesis Series — original characters.
  { id: "bolt-01", name: "Bolt-01", category: "Robot", collection: "original", desc: "A reliable little workshop companion.", difficulty: "Beginner", time: "30–45 min", art: "bolt" },
  { id: "nova", name: "Nova", category: "Sci-Fi", collection: "original", desc: "A curious traveller from the edge of the stars.", difficulty: "Intermediate", time: "45–60 min", art: "nova" },
  { id: "ember", name: "Ember", category: "Fantasy", collection: "original", desc: "A warm-hearted guardian with a spark of courage.", difficulty: "Intermediate", time: "45–60 min", art: "ember" },
  { id: "atlas-mk2", name: "Atlas-MK2", category: "Robot", collection: "original", desc: "A sturdy defence mech built for big missions.", difficulty: "Advanced", time: "60–90 min", art: "atlas" },
  { id: "mossback", name: "Mossback", category: "Fantasy", collection: "original", desc: "A gentle protector of ancient green places.", difficulty: "Intermediate", time: "45–60 min", art: "mossback" },
  { id: "tidefin", name: "Tidefin", category: "Sci-Fi", collection: "original", desc: "A deep-ocean scout searching for lost wonders.", difficulty: "Intermediate", time: "45–60 min", art: "tidefin" },
  { id: "prism", name: "Prism", category: "Fantasy", collection: "original", desc: "A crystal scholar who channels colour and light.", difficulty: "Advanced", time: "60–75 min", art: "prism" },
  { id: "drift", name: "Drift", category: "Sci-Fi", collection: "original", desc: "A fast-moving pilot from the skyline circuit.", difficulty: "Intermediate", time: "45–60 min", art: "drift" },
  { id: "cinder", name: "Cinder", category: "Fantasy", collection: "original", desc: "A tiny dragon with a huge sense of adventure.", difficulty: "Beginner", time: "30–45 min", art: "cinder" },
  { id: "orbit", name: "Orbit", category: "Sci-Fi", collection: "original", desc: "A practical engineer keeping the crew on course.", difficulty: "Beginner", time: "30–45 min", art: "orbit" }
];

const grid = document.querySelector('#blueprint-grid');
const search = document.querySelector('#search');
const empty = document.querySelector('.empty');

let active = 'all';


/* =========================================
   GOOGLE ANALYTICS HELPER
========================================= */

function trackEvent(eventName, parameters = {}) {
  if (typeof gtag === 'function') {
    gtag('event', eventName, parameters);
  }
}


/* =========================================
   BLUEPRINT CARD
========================================= */

function card(b) {
  return `
    <article class="bp-card" data-id="${b.id}">

      <button
        class="bp-art ${b.art}"
        aria-label="View ${b.name} blueprint details"
      >
        <span>PF-${b.id.toUpperCase()}</span>
        <i class="figure-shape"></i>
      </button>

      <div class="card-content">

        <span class="category">${b.category} · ${b.collection === "fan" ? "FAN CREATION" : "ORIGINAL"}</span>

        <h3>${b.name}</h3>

        <p>${b.desc}</p>

        <div class="meta">
          <span>${b.difficulty}</span>
          <span>${b.time}</span>
        </div>

        <button
          class="button ghost download"
          data-download="${b.id}"
        >
          ${b.pdf ? "Download PDF ↓" : "Blueprint coming soon"}
        </button>

      </div>

    </article>
  `;
}


/* =========================================
   RENDER BLUEPRINTS
========================================= */

function render() {
  const term = search.value.toLowerCase().trim();

  const shown = blueprints.filter(b => {

    const filter =
      active === 'all' ||
      b.category.toLowerCase() === active ||
      (active === 'beginner' && b.difficulty === 'Beginner') ||
      (active === 'fan' && b.collection === 'fan');

    const matchesSearch =
      b.name.toLowerCase().includes(term) ||
      b.category.toLowerCase().includes(term);

    return filter && matchesSearch;
  });

  grid.innerHTML = shown.map(card).join('');

  empty.hidden = shown.length > 0;
}

render();


/* =========================================
   SEARCH TRACKING
========================================= */

let searchTimer;

search.addEventListener('input', () => {

  render();

  clearTimeout(searchTimer);

  searchTimer = setTimeout(() => {

    const term = search.value.trim();

    if (term) {
      trackEvent('blueprint_search', {
        search_term: term
      });
    }

  }, 800);
});


/* =========================================
   CATEGORY FILTERS
========================================= */

document.querySelectorAll('.filter').forEach(button => {

  button.addEventListener('click', () => {

    const currentActive =
      document.querySelector('.filter.active');

    if (currentActive) {
      currentActive.classList.remove('active');
    }

    button.classList.add('active');

    active = button.dataset.filter;

    render();

    trackEvent('blueprint_filter', {
      filter_category: active
    });
  });

});


/* =========================================
   BLUEPRINT MODAL
========================================= */

const modal = document.querySelector('#detail-modal');
const modalContent = document.querySelector('#modal-content');


grid.addEventListener('click', event => {

  const cardElement =
    event.target.closest('.bp-card');

  if (!cardElement) return;


  const blueprint = blueprints.find(
    item => item.id === cardElement.dataset.id
  );

  if (!blueprint) return;


  /* -----------------------------------------
     DIRECT DOWNLOAD
  ----------------------------------------- */

  if (event.target.closest('[data-download]')) {

    if (blueprint.pdf) {

      trackEvent('blueprint_download', {
        blueprint_id: blueprint.id,
        blueprint_name: blueprint.name,
        file_name: blueprint.pdf
      });

      window.open(blueprint.pdf, '_blank');

    } else {

      toast(
        'Blueprint coming soon. Check back shortly!'
      );
    }

    return;
  }


  /* -----------------------------------------
     OPEN BLUEPRINT DETAILS
  ----------------------------------------- */

  trackEvent('blueprint_view', {
    blueprint_id: blueprint.id,
    blueprint_name: blueprint.name
  });


  modalContent.innerHTML = `

    <div class="modal-layout">

      <div class="bp-art ${blueprint.art}">
        <i class="figure-shape"></i>
      </div>

      <div>

        <span class="category">
          ${blueprint.category} · ${blueprint.collection === "fan" ? "FAN CREATION" : "ORIGINAL"}
        </span>

        <h2>${blueprint.name}</h2>

        <p class="lede">
          ${blueprint.desc}
        </p>

        <div class="meta">
          <span>${blueprint.difficulty}</span>
          <span>${blueprint.time}</span>
        </div>


        <div class="button-row">

          <button
            class="button primary"
            data-modal-download
          >
            ${blueprint.pdf ? "Download PDF" : "Blueprint coming soon"}
          </button>


          <button
            class="button ghost"
            data-toast="Instructions will be added with the final blueprint."
          >
            View Instructions
          </button>


          <button
            class="button ghost"
            data-share
          >
            Share
          </button>

        </div>


        <h3>
          What you'll need
        </h3>


        <div class="need-list">

          <span>• A4 paper</span>
          <span>• Printer</span>
          <span>• Scissors</span>
          <span>• Glue</span>
          <span>• Ruler</span>
          <span>• Optional coloring tools</span>

        </div>


        <h3>
          Build Preview
        </h3>


        <div class="build-preview">

          <span>1. PRINT</span>
          <span>2. CUT</span>
          <span>3. FOLD</span>
          <span>4. BUILD</span>

        </div>


        <p class="safety">
          Always follow safe crafting practices when using scissors or other tools.
        </p>

      </div>

    </div>
  `;


  modal.showModal();


  /* -----------------------------------------
     MODAL DOWNLOAD
  ----------------------------------------- */

  const modalDownload =
    modalContent.querySelector('[data-modal-download]');


  modalDownload.addEventListener('click', () => {

    if (blueprint.pdf) {

      trackEvent('blueprint_download', {
        blueprint_id: blueprint.id,
        blueprint_name: blueprint.name,
        file_name: blueprint.pdf,
        source: 'modal'
      });

      window.open(blueprint.pdf, '_blank');

    } else {

      toast(
        'Blueprint coming soon. Check back shortly!'
      );

    }

  });

});


/* =========================================
   CLOSE MODAL
========================================= */

document.querySelector('.modal-close').onclick = () => {
  modal.close();
};


modal.addEventListener('click', event => {

  if (event.target === modal) {
    modal.close();
  }

});


/* =========================================
   MODAL BUTTONS
========================================= */

modalContent.addEventListener('click', event => {


  /* -----------------------------------------
     SHARE BUTTON
  ----------------------------------------- */

  if (event.target.matches('[data-share]')) {

    navigator.clipboard?.writeText(location.href);

    trackEvent('blueprint_share', {
      page_url: location.href
    });

    toast(
      'Link copied to clipboard!'
    );

  }


  /* -----------------------------------------
     TOAST BUTTONS
  ----------------------------------------- */

  if (event.target.dataset.toast) {

    toast(
      event.target.dataset.toast
    );

  }

});


/* =========================================
   TOAST
========================================= */

const toastEl =
  document.querySelector('.toast');

let timer;


function toast(message) {

  toastEl.textContent = message;

  toastEl.classList.add('show');

  clearTimeout(timer);

  timer = setTimeout(() => {

    toastEl.classList.remove('show');

  }, 3000);

}


document.querySelectorAll('[data-toast]').forEach(element => {

  element.onclick = () => {

    toast(element.dataset.toast);

  };

});


/* =========================================
   EMAIL SIGNUP
========================================= */

document
  .querySelector('#signup-form')
  .addEventListener('submit', event => {

    event.preventDefault();


    trackEvent('newsletter_signup', {
      method: 'paperforge_form'
    });


    event.currentTarget
      .querySelector('.form-message')
      .textContent =
      'You’re on the forge list — welcome aboard!';


    event.currentTarget.reset();

  });


/* =========================================
   MOBILE NAVIGATION
========================================= */

const nav =
  document.querySelector('nav');

const toggle =
  document.querySelector('.menu-toggle');


toggle.onclick = () => {

  const open =
    nav.classList.toggle('open');


  toggle.setAttribute(
    'aria-expanded',
    open
  );


  toggle.setAttribute(
    'aria-label',
    open
      ? 'Close navigation'
      : 'Open navigation'
  );

};


nav.querySelectorAll('a').forEach(link => {

  link.onclick = () => {

    nav.classList.remove('open');

  };

});


/* =========================================
   SCROLL REVEAL
========================================= */

const observer =
  new IntersectionObserver(
    items => {

      items.forEach(item => {

        if (item.isIntersecting) {

          item.target.classList.add(
            'visible'
          );

          observer.unobserve(
            item.target
          );

        }

      });

    },
    {
      threshold: 0.1
    }
  );


document
  .querySelectorAll('.reveal')
  .forEach(element => {

    observer.observe(element);

  });




/* =========================================
   PAPERFORGE — CONTINUOUS SCROLL ATMOSPHERE
   Colours blend between sections, with gentle
   parallax movement for a living background.
========================================= */
(() => {
  const scenes = [
    ['#d9c8ff','#bfeeff','#ffe0ed'], // Hero
    ['#bceeff','#d9d0ff','#d8fff0'], // Blueprints
    ['#baf5e8','#c8efff','#e6dcff'], // Frame Lab
    ['#c7f2df','#c8e6ff','#f0e9ff'], // How it works
    ['#dfd0ff','#c9f3ff','#ffe4d2'], // Featured
    ['#c9f3dc','#ffe0c8','#d9e6ff'], // Community
    ['#d8d0ff','#ffd8e8','#c9f5ff'], // Social
    ['#ffe3c8','#ffd5e5','#e4d9ff'], // Signup
    ['#dfd4ff','#c9edff','#ffe8cf']  // Premium
  ];
  const sections = [...document.querySelectorAll('main > section')];
  if (!sections.length) return;

  const hexToRgb = hex => {
    const value = hex.replace('#','');
    return [0,2,4].map(i => parseInt(value.slice(i,i+2),16));
  };
  const mix = (a,b,t) => {
    const x=hexToRgb(a), y=hexToRgb(b);
    return '#'+x.map((v,i)=>Math.round(v+(y[i]-v)*t).toString(16).padStart(2,'0')).join('');
  };

  let ticking=false;
  const update = () => {
    ticking=false;
    const marker=window.innerHeight*0.48;
    let index=0;
    for(let i=0;i<sections.length;i++){
      if(sections[i].getBoundingClientRect().top<=marker) index=i;
      else break;
    }
    const current=sections[index];
    const next=sections[Math.min(index+1,sections.length-1)];
    const start=current.getBoundingClientRect().top;
    const distance=Math.max(1,next.getBoundingClientRect().top-start || current.offsetHeight);
    const blend=index===sections.length-1 ? 0 : Math.min(1,Math.max(0,(marker-start)/distance));
    const a=scenes[Math.min(index,scenes.length-1)];
    const b=scenes[Math.min(index+1,scenes.length-1)];
    ['--scene-a','--scene-b','--scene-c'].forEach((name,i)=>{
      document.body.style.setProperty(name,mix(a[i],b[i],blend));
    });
    const maxScroll=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);
    const progress=Math.min(1,Math.max(0,window.scrollY/maxScroll));
    document.body.style.setProperty('--scroll-progress',(progress*100).toFixed(2)+'%');
    document.body.style.setProperty('--parallax-y',(progress*90-45).toFixed(1)+'px');
    document.body.dataset.scrollScene=String(index);
  };
  const requestUpdate=()=>{
    if(!ticking){ticking=true;window.requestAnimationFrame(update);}
  };
  window.addEventListener('scroll',requestUpdate,{passive:true});
  window.addEventListener('resize',requestUpdate);
  update();
})();;
