from sympy import *
from sympy.parsing.sympy_parser import parse_expr

class Particle:
    def __init__(self, pojo):
        self.name = pojo["name"]
        self.placement = pojo["placement"]
        self.mass = pojo.get('mass', Symbol('m_' + self.name))
        self.placement_type = pojo["placement"]["type"]
        self.parameters = self.build_parameters()

    def position_parameters(self):
        if self.placement_type == 'free':
            return { 'x': Symbol(self.name + "_x"), 'y': Symbol(self.name + "_y") }
        elif self.placement_type == 'constrained':
            return { 'a': Symbol(self.name + "_a") }
        elif self.placement_type == 'pole':
            return { 'theta': Symbol(self.name + "_\\theta") }

    def build_parameters(self):
        params = self.position_parameters()
        return {**params, **{ x + "_dot": Symbol("\\dot{" + y.name + "}") for (x, y) in params.items() }}

    def position(self, system):
        if self.placement_type == 'free':
            return [self.parameters['x'], self.parameters['y']]
        if self.placement_type == "constrained":
            x = parse_expr(self.placement['x']).subs('a', self.parameters['a'])
            y = parse_expr(self.placement['y']).subs('a', self.parameters['a'])
            return [x, y]
        if self.placement_type == 'pole':
            if self.placement['origin']['type'] == 'fixed':
                origin_x = self.placement['origin']['x']
                origin_y = self.placement['origin']['y']
            elif self.placement['origin']['type'] == 'particle':
                origin_x, origin_y = system.position(self.placement['origin']['particle'])

            theta = self.parameters['theta']
            length = self.placement['length']
            x = sin(theta) * length + origin_x
            y = cos(theta) * length + origin_y
            return [x, y]

    def velocity(self, system):
        if self.placement_type == 'free':
            return [self.parameters['x_dot'], self.parameters['y_dot']]
        if self.placement_type == "constrained":
            x = parse_expr(self.placement['x']).subs('a', self.parameters['a'])
            a = self.parameters['a']
            dx_da = diff(x, a)
            x_dot = dx_da * self.parameters['a_dot']

            y = parse_expr(self.placement['y']).subs('a', self.parameters['a'])
            dy_da = diff(y, a)
            y_dot = dy_da * self.parameters['a_dot']

            return [x_dot, y_dot]
        if self.placement_type == 'pole':
            if self.placement['origin']['type'] == 'fixed':
                origin_x_dot, origin_y_dot = 0, 0
            elif self.placement['origin']['type'] == 'particle':
                origin_x_dot, origin_y_dot = system.velocity(self.placement['origin']['particle'])

            theta_dot = self.parameters['theta_dot']
            length = self.placement['length']
            x_dot = cos(theta_dot) * length + origin_x_dot
            y_dot = cos(theta_dot) * length + origin_y_dot
            return [x_dot, y_dot]

    def potential_energy(self, system):
        PE = 0
        if system.gravity:
            PE += self.mass * Symbol('g') * self.position(system)[1]
        return PE

    def kinetic_energy(self, system):
        if self.placement_type == 'pole':
            speed = self.placement['length'] * self.parameters['theta_dot']
            return 0.5 * self.mass * speed ** 2
        else:
            return 0.5 * self.mass * sum(z ** 2 for z in self.velocity(system))

