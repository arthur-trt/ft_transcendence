import Particles from "react-particles";
import { loadFull } from "tsparticles";

export default function Auth() {

    const particlesInit = async (main:any) => {
        // you can initialize the tsParticles instance (main) here, adding custom shapes or presets
        // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
        // starting from v2 you can add only the features you need reducing the bundle size
        await loadFull(main);
      };

    return (
        <div>
            <div className="auth-link">
                <h2>42 AUTHENTICATION</h2>
                <p>You must log in with your 42 account.</p>
                <a href='/api/auth/42/login'><img src="42logo.png" alt="logo 42"></img>LOGIN</a>
            </div>

            <div className="App">

        {/* PARTICLES STARTS HERE */}
        {/* COMMENT THIS LINE IN INTERACTIVITY "detect_on": "canvas", */}
       <Particles
      id="tsparticles"
      init={particlesInit}

      options={{
        "fullScreen": {
            "enable": true,
            "zIndex": -1
        },
            "particles": {
              "number": {
                "value": 183,
                "density": {
                  "enable": true,
                  "value_area": 641.3648243462092
                }
              },
              "color": {
                "value": "#1dd1a1"
              },
              "shape": {
                "type": "circle",
                "stroke": {
                  "width": 0,
                  "color": "#000000"
                },
                "polygon": {
                  "nb_sides": 5
                },
                "image": {
                  "src": "img/github.svg",
                  "width": 100,
                  "height": 100
                }
              },
              "opacity": {
                "value": 1,
                "random": true,
                "anim": {
                  "enable": true,
                  "speed": 1,
                  "opacity_min": 0,
                  "sync": false
                }
              },
              "size": {
                "value": 3,
                "random": true,
                "anim": {
                  "enable": false,
                  "speed": 4,
                  "size_min": 0.3,
                  "sync": false
                }
              },
              "line_linked": {
                "enable": false,
                "distance": 150,
                "color": "#ffffff",
                "opacity": 0.4,
                "width": 1
              },
              "move": {
                "enable": true,
                "speed": 1,
                "direction": "none",
                "random": true,
                "straight": false,
                "out_mode": "out",
                "bounce": false,
                "attract": {
                  "enable": false,
                  "rotateX": 600,
                  "rotateY": 600
                }
              }
            },
            "interactivity": {
            //   "detect_on": "canvas",
              "events": {
                "onhover": {
                  "enable": false,
                  "mode": "bubble"
                },
                "onclick": {
                  "enable": false,
                  "mode": "repulse"
                },
                "resize": true
              },
              "modes": {
                "grab": {
                  "distance": 400,
                  "line_linked": {
                    "opacity": 1
                  }
                },
                "bubble": {
                  "distance": 250,
                  "size": 0,
                  "duration": 2,
                  "opacity": 0,
                  "speed": 3
                },
                "repulse": {
                  "distance": 400,
                  "duration": 0.4
                },
                "push": {
                  "particles_nb": 4
                },
                "remove": {
                  "particles_nb": 2
                }
              }
            },
            "retina_detect": true
          }}


    />
    </div> 
    {/* PARTICLES ENDS HERE */}

        </div>
    );
}
