from sympy import *
from sympy.parsing.sympy_parser import parse_expr

class Particle:
    def __init__(self, pojo):
        self.name = pojo["name"]
        self.position = pojo["position"]
        self.mass = pojo.get('mass', Symbol('m_' + self.name))
        self.position_type = pojo["position"]["type"]
        self.parameters = self.build_parameters()

    def position_parameters(self):
        if self.position_type == 'free':
            return { 'x': Symbol(self.name + "_x"), 'y': Symbol(self.name + "_y") }
        elif self.position_type == 'constrained':
            return { 'a': Symbol(self.name + "_a") }
        elif self.position_type == 'pole':
            return { 'theta': Symbol(self.name + "_theta") }

    def build_parameters(self):
        params = self.position_parameters()
        return {**params, **{ x + "_dot": Symbol(y.name + "_dot") for (x, y) in params.items() }}

    def cartesian_position(self, system):
        if self.position_type == 'free':
            return [self.parameters['x'], self.parameters['y']]
        if self.position_type == "constrained":
            x = parse_expr(self.position['x']).subs('a', self.parameters['a'])
            y = parse_expr(self.position['y']).subs('a', self.parameters['a'])
            return [x, y]
        if self.position_type == 'pole':
            if self.position['origin']['type'] == 'fixed':
                origin_x, origin_y = self.position['origin']['position']
            elif self.position['origin']['type'] == 'particle':
                origin_x, origin_y = system.cartesian_position(self.position['origin']['particle'])

            theta = self.parameters['theta']
            length = self.position['length']
            x = sin(theta) * length + origin_x
            y = cos(theta) * length + origin_y
            return [x, y]

    def cartesian_velocity(self, system):
        if self.position_type == 'free':
            return [self.parameters['x_dot'], self.parameters['y_dot']]
        if self.position_type == "constrained":
            x = parse_expr(self.position['x']).subs('a', self.parameters['a'])
            a = self.parameters['a']
            dx_da = diff(x, a)
            x_dot = dx_da * self.parameters['a_dot']

            y = parse_expr(self.position['y']).subs('a', self.parameters['a'])
            dy_da = diff(y, a)
            y_dot = dy_da * self.parameters['a_dot']

            return [x_dot, y_dot]
        if self.position_type == 'pole':
            if self.position['origin']['type'] == 'fixed':
                origin_x_dot, origin_y_dot = 0, 0
            elif self.position['origin']['type'] == 'particle':
                origin_x_dot, origin_y_dot = system.cartesian_velocity(self.position['origin']['particle'])

            theta_dot = self.parameters['theta_dot']
            length = self.position['length']
            x_dot = cos(theta_dot) * length + origin_x_dot
            y_dot = cos(theta_dot) * length + origin_y_dot
            return [x_dot, y_dot]

    def potential_energy(self, system):
        PE = 0
        if system.gravity:
            PE += self.mass * Symbol('g') * self.cartesian_position(system)[1]
        return PE

    def kinetic_energy(self, system):
        if self.position_type == 'pole':
            speed = self.position['length'] * self.parameters['theta_dot']
            return 0.5 * self.mass * speed ** 2
        else:
            return 0.5 * self.mass * sum(z ** 2 for z in self.cartesian_velocity(system))

