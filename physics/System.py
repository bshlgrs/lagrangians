from sympy import *
from physics.Particle import Particle

class System:
    def __init__(self, pojo):
        self.particles = { x['name']: Particle(x) for x in pojo['particles'] }
        self.gravity = pojo['gravity']

    def position(self, name):
        return self.particles[name].position(self)

    def velocity(self, name):
        return self.particles[name].velocity(self)

    def kinetic_energy(self):
        return sum(particle.kinetic_energy(self) for particle in self.particles.values()).simplify()

    def potential_energy(self):
        return sum(particle.potential_energy(self) for particle in self.particles.values())

    def lagrangian(self):
        return self.kinetic_energy() - self.potential_energy()

    def equations_of_motion(self):
        lagrangian = self.lagrangian()

        out = {}

        for particle in self.particles.values():
            mass = particle.mass
            for coord in particle.position_parameters().values():
                coord_dot = Symbol("\\dot{" + coord.name + "}")
                coord_double_dot = Symbol("\\ddot{" + coord.name + "}")
                d_L_on_d_coord_dot = diff(lagrangian, coord_dot)
                d_L_on_d_coord_dot_dot = d_L_on_d_coord_dot.subs(
                    {coord: coord_dot, coord_dot: coord_double_dot})

                d_L_on_d_coord = diff(lagrangian, coord)

                coord_accelleration = solve(d_L_on_d_coord_dot_dot - d_L_on_d_coord,
                                            coord_double_dot)[0]

                out[coord] = coord_accelleration
        return out

