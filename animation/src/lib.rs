extern crate wasm_bindgen;

use wasm_bindgen::prelude::*;
use web_sys::CanvasRenderingContext2d;

#[wasm_bindgen]
pub struct Particle {
    x: f64,
    y: f64,
    home_x: f64,
    home_y: f64,
}

#[wasm_bindgen]
impl Particle {
    fn tick(&mut self) {
        let dx = self.home_x - self.x;
        let dy = self.home_y - self.y;
        self.x += 0.05 + rand::random::<f64>() * 0.1 * dx;
        self.y += 0.05 + rand::random::<f64>() * 0.1 * dy;
    }
}

#[wasm_bindgen]
pub struct System {
    width: f64,
    height: f64,
    particles: Vec<Particle>,
}

#[wasm_bindgen]
impl System {
    pub fn new(width: f64, height: f64) -> System {
        return System {
            width,
            height,
            particles: Vec::new(),
        };
    }

    pub fn add_particle(&mut self, home_x: f64, home_y: f64) {
        self.particles.push(Particle {
            x: self.width * rand::random::<f64>(),
            y: self.height * rand::random::<f64>(),
            home_x,
            home_y,
        });
    }

    fn update_particles(&mut self, mouse_x: f64, mouse_y: f64) {
        for particle in self.particles.iter_mut() {
            let Particle { x, y, .. } = particle;
            {
                let dx = mouse_x - *x;
                let dy = mouse_y - *y;
                if dx * dx + dy * dy < rand::random::<f64>().powf(5.) * 25. * 25. {
                    particle.x = self.width * rand::random::<f64>();
                    particle.y = self.height * rand::random::<f64>();
                    continue;
                }
            }
            particle.tick()
        }
    }

    pub fn tick(&mut self, mouse_x: f64, mouse_y: f64, ctx: &CanvasRenderingContext2d) {
        self.draw_background(ctx);
        self.update_particles(mouse_x, mouse_y);
        self.draw_particles(ctx)
    }

    fn draw_background(&self, ctx: &CanvasRenderingContext2d) {
        ctx.clear_rect(0., 0., self.width, self.height);
    }

    fn draw_particles(&self, ctx: &CanvasRenderingContext2d) {
        for particle in self.particles.iter() {
            ctx.fill_rect(particle.x, particle.y, 1., 1.);
        }
    }
}
