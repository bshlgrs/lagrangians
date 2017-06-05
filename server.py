from flask import Flask, Response, request
import json
from physics.System import System
from sympy import latex

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/calc/', methods=['POST'])
def calc():
    pojo = request.get_json()

    # try:
    system = System(request.get_json())

    equations_of_motion = system.equations_of_motion()

    response_json = json.dumps({
        'kinetic_energy': latex(system.kinetic_energy()),
        'potential_energy': latex(system.potential_energy()),
        'lagrangian': latex(system.lagrangian()),
        'equations_of_motion': {
            str(x): latex(y) for x, y in equations_of_motion.items()
        }
    })

    resp = Response(response_json, status=200, mimetype='application/json')
    return resp
    # except Exception as e:
    #     print(e)
    #     resp = Response(str(e), status=400, mimetype='application/text')
    #     return resp

if __name__ == "__main__":
    app.run()

