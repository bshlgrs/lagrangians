import Immutable from 'immutable';

export default class System{
  constructor(map) {
    this.map = map;
  }

  addParticle() {
    return new System(this.map.update('particles', (l) =>
      l.push(blankParticle.set('name', this.nextName()))))
  }

  nextName () {
    const names = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (var i=0; i < names.length; i++) {
      const letter = names.charAt(i);
      if (! this.particles().some((p) => p.get('name') === letter)) {
        return letter;
      }
    }

    // give up.
    // TODO: something better here.
  }

  particles () {
    return this.map.get('particles');
  }

  forces () {
    return this.map.get('forces');
  }

  gravity () {
    return this.map.get('gravity');
  }

  toggleGravity() {
    return new System(this.map.update('gravity', (g) => !g));
  }

  updateParticle(name, f) {
    return new System(this.map.update('particles', (particles) => particles.map(
      (p) => p.get('name') === name ? f(p) : p
    )));
  }

  deleteParticle(name, f) {
    return new System(this.map.update('particles', (particles) => particles.filter(
      (p) => p.get('name') !== name
    )));
  }

  addSpring() {
    return new System(this.map.update('forces', (l) =>
      l.push(Immutable.Map({ type: 'spring' }))))
  }
}

const blankParticle = Immutable.fromJS({
  placement: Immutable.Map({type: 'free'}),
  mass: 1
})

System.blank = new System(Immutable.fromJS({
  particles: [],
  gravity: true,
  forces: []
}));
