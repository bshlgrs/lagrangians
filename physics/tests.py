from System import System
import unittest
from sympy import *

class TestPhysics(unittest.TestCase):
    def test_simple(self):
        freefall = System({
            'particles': [
                {
                    'name': 'A',
                    'mass': 1,
                    'position': { 'type': 'constrained', 'x': '0', 'y': 'a' }
                }
            ],
            'gravity': True
        })

        A_a = Symbol("A_a")
        A_a_dot = Symbol("A_a_dot")
        g = Symbol("g")
        assert freefall.kinetic_energy() == 0.5*A_a_dot**2
        assert freefall.potential_energy() == A_a * g
        assert freefall.lagrangian() == -A_a*g + 0.5*A_a_dot**2
        assert freefall.equations_of_motion() == {A_a: -g}

    def test_pendulum(self):
        # This matches the example here:
        # http://www.aoengr.com/Dynamics/LagrangianMechanicsPendulum.pdf

        A_theta = Symbol("A_theta")
        A_theta_dot = Symbol("A_theta_dot")
        g = Symbol("g")
        l = Symbol("l")
        m_A = Symbol("m_A")

        single_pendulum = System({
            'particles': [
                { 'name': 'A',
                  'position': {
                      'type': 'pole',
                      'origin': {'type': 'fixed', 'position': (0, 0) },
                      'length': l

                  }
                }
            ],
            'gravity': True
        })

        assert single_pendulum.kinetic_energy() == 0.5*A_theta_dot**2*m_A*l**2
        assert single_pendulum.potential_energy() == m_A*g*l*cos(A_theta)
        assert single_pendulum.lagrangian() ==  0.5*A_theta_dot**2*m_A*l**2 - m_A*g*l*cos(A_theta)
        assert single_pendulum.equations_of_motion() ==  {A_theta: g*sin(A_theta)/l}


    def test_double_pendulum(self):
        double_pendulum = System({
            'particles': [
                { 'name': 'A',
                  'position': { 'type': 'pole', 'origin': {'type': 'fixed', 'position': (0, 0) }, 'length': 1 }
                },
                { 'name': 'B',
                  'mass': 1,
                  'position': { 'type': 'pole', 'origin': {'type': 'particle', 'particle': 'A' }, 'length': 1 }
                }
            ],
            'gravity': True
        })

        A_theta = Symbol("A_theta")
        B_theta = Symbol("B_theta")
        g = Symbol("g")
        m_A = Symbol("m_A")


        self.assertEquals(double_pendulum.equations_of_motion(), {
            A_theta: g*(m_A + 1.0)*sin(A_theta)/m_A,
            B_theta: g*sin(B_theta)
        })

