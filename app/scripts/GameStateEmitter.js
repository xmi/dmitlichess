const states = [
  'aborted',
  'stalemate',
  'checkmate',
  'draw',
  'time out',
  'white resigned',
  'black resigned'
];

class GameStateEmitter {
  constructor(elements) {
    this.elements = elements;
    this.observers = [];
  }
  
  resultElementAdded(mutations) {
    return mutations.some((mutation)=> Utils.mutation.hasAddedNodes(mutation, 'result_wrap'));
  }

  handleMutations(mutations) {
    if (!this.resultElementAdded(mutations)) { return; }
    if (!Utils.isGameOver()) { return; }

    const status = document.querySelector('.status');
    const text = status && status.innerText.toLowerCase();
    const state = states.reduce((a, v)=> text.includes(v) ? v : a, undefined);

    this.elements.main.dispatchEvent(new CustomEvent('state', {
      detail: {
        isOver: true,
        state: state
      }
    }));

    // Disconnect after the game ends to prevent triggering again on rematch
    this.disconnect();
  }
  
  createObserver() {
    const el = this.elements.moves;
    const observer = new MutationObserver((mutations)=> this.handleMutations(mutations));
    const config = { childList: true, subtree: false };

    if (el) { observer.observe(el, config); }

    return observer;
  }

  disconnect() {
    this.observers.map((o)=> o.disconnect());
  }

  init() {
    this.observers = [];
    this.observers.push(this.createObserver());

    if (Utils.isGameStart()) {
      this.elements.main.dispatchEvent(new CustomEvent('start'));
    }
  }
}

