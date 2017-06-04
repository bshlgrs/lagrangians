import { observable, computed, action, autorun } from 'mobx';

export default class SystemStore {
  @observable cards;

  constructor() {
    try {
      this.cards = JSON.parse(localStorage.cards) || [];
    } catch (e) {
      this.cards = [];
    }

    autorun(() => localStorage.cards = JSON.stringify(this.cards));
  }

  emptyCard() {
    return { front: "", back: "" };
  }

  @action addCard() {
    this.cards.push(this.emptyCard());
  }

  @action deleteCard(index) {
    this.cards.splice(index, 1);
  }

  @computed get numberOfCards() {
    return this.cards.length;
  }

  @action editCardFront(idx, value) {
    this.cards[idx].front = value;
  }

  @action editCardBack(idx, value) {
    this.cards[idx].back = value;
  }


}
