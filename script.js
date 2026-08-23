const blueprints = [
  {
    id: 'luffy',
    name: 'Luffy',
    category: 'Hero',
    desc: 'A printable paper character blueprint.',
    difficulty: 'Intermediate',
    time: '45–60 min',
    art: 'bolt',
    pdf: 'luffy.pdf'
  },
  {
    id: 'nova',
    name: 'Nova',
    category: 'Hero',
    desc: 'A futuristic original hero designed specifically for paper construction.',
    difficulty: 'Intermediate',
    time: '45–60 min',
    art: 'nova'
  },
  {
    id: 'ember',
    name: 'Ember',
    category: 'Fantasy',
    desc: 'A small fantasy guardian with a bold silhouette.',
    difficulty: 'Intermediate',
    time: '45–60 min',
    art: 'ember'
  },
  {
    id: 'atlas-mk2',
    name: 'Atlas-MK2',
    category: 'Robot',
    desc: 'A larger mech-style paper figure for experienced builders.',
    difficulty: 'Advanced',
    time: '60–90 min',
    art: 'atlas'
  }
];

const grid = document.querySelector('#blueprint-grid');
const search = document.querySelector('#search');
const empty = document.querySelector('.empty');

let active = 'all';

function card(b) {
  return `
    <article class="bp-card" data-id="${b.id}">
      <button class="bp-art ${b.art}" aria-label="View ${b.name} blueprint details">
        <span>PF-${b.id.toUpperCase()}</span>
        <i class="figure-shape"></i>
      </button>

      <div class="card-content">
        <span class="category">${b.category}</span>
        <h3>${b.name}</h3>
        <p>${b.desc}</p>

        <div class="meta">
          <span>${b.difficulty}</span>
          <span>${b.time}</span>
        </div>

        <button class="button ghost download" data-download="${b.id}">
          Download PDF ↓
        </button>
      </div>
    </article>
  `;
}

function render() {
  const term = search.value.toLowerCase().trim();

  const shown = blueprints.filter(b => {
    const filter =
      active === 'all' ||
      b.category.toLowerCase() === active ||
      (active === 'beginner' && b.difficulty === 'Beginner');

    const matchesSearch =
      b.name.toLowerCase().includes(term) ||
      b.category.toLowerCase().includes(term);

    return filter && matchesSearch;
  });

  grid.innerHTML = shown.map(card).join('');
  empty.hidden = shown.length > 0;
}

render();

search.addEventListener('input', render);

document.querySelectorAll('.filter').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelector('.filter.active').classList.remove('active');

    button.classList.add('active');

    active = button.dataset.filter;

    render();
  });
});

const modal = document.querySelector('#detail-modal');
const modalContent = document.querySelector('#modal-content');

grid.addEventListener('click', event => {
  const cardElement = event.target.closest('.bp-card');

  if (!cardElement) return;

  const blueprint = blueprints.find(
    item => item.id === cardElement.dataset.id
  );

  if (!blueprint) return;

  // Direct Download PDF button
  if (event.target.closest('[data-download]')) {
    if (blueprint.pdf) {
      window.open(blueprint.pdf, '_blank');
    } else {
      toast('Blueprint coming soon. Check back shortly!');
    }

    return;
  }

  // Open blueprint details modal
  modalContent.innerHTML = `
    <div class="modal-layout">

      <div class="bp-art ${blueprint.art}">
        <span>PF-${blueprint.id.toUpperCase()}</span>
        <i class="figure-shape"></i>
      </div>

      <div>
        <span class="category">${blueprint.category}</span>

        <h2>${blueprint.name}</h2>

        <p class="lede">${blueprint.desc}</p>

        <div class="meta">
          <span>${blueprint.difficulty}</span>
          <span>${blueprint.time}</span>
        </div>

        <div class="button-row">

          <button class="button primary" data-modal-download>
            Download PDF
          </button>

          <button
            class="button ghost"
            data-toast="Instructions will be added with the final blueprint."
          >
            View Instructions
          </button>

          <button class="button ghost" data-share>
            Share
          </button>

        </div>

        <h3>What you'll need</h3>

        <div class="need-list">
          <span>• A4 paper</span>
          <span>• Printer</span>
          <span>• Scissors</span>
          <span>• Glue</span>
          <span>• Ruler</span>
          <span>• Optional coloring tools</span>
        </div>

        <h3>Build Preview</h3>

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

  // Modal Download PDF button
  const modalDownload =
    modalContent.querySelector('[data-modal-download]');

  modalDownload.addEventListener('click', () => {
    if (blueprint.pdf) {
      window.open(blueprint.pdf, '_blank');
    } else {
      toast('Blueprint coming soon. Check back shortly!');
    }
  });
});

document.querySelector('.modal-close').onclick = () => {
  modal.close();
};

modal.addEventListener('click', event => {
  if (event.target === modal) {
    modal.close();
  }
});

modalContent.addEventListener('click', event => {

  // Share button
  if (event.target.matches('[data-share]')) {
    navigator.clipboard?.writeText(location.href);

    toast('Link copied to clipboard!');
  }

  // Toast buttons
  if (event.target.dataset.toast) {
    toast(event.target.dataset.toast);
  }
});

const toastEl = document.querySelector('.toast');

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

document.querySelector('#signup-form').addEventListener('submit', event => {
  event.preventDefault();

  event.currentTarget.querySelector('.form-message').textContent =
    'You’re on the forge list — welcome aboard!';

  event.currentTarget.reset();
});

const nav = document.querySelector('nav');
const toggle = document.querySelector('.menu-toggle');

toggle.onclick = () => {
  const open = nav.classList.toggle('open');

  toggle.setAttribute('aria-expanded', open);

  toggle.setAttribute(
    'aria-label',
    open ? 'Close navigation' : 'Open navigation'
  );
};

nav.querySelectorAll('a').forEach(link => {
  link.onclick = () => {
    nav.classList.remove('open');
  };
});

const observer = new IntersectionObserver(
  items => {
    items.forEach(item => {
      if (item.isIntersecting) {
        item.target.classList.add('visible');

        observer.unobserve(item.target);
      }
    });
  },
  {
    threshold: 0.1
  }
);

document.querySelectorAll('.reveal').forEach(element => {
  observer.observe(element);
});
