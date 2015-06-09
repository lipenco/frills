;(function(global, $) {

    // 'new' an object
    var Frills = function(firstName, lastName, language) {
        return new Frills.init(firstName, lastName, language);
    }

    var context;
    var RADIUS_SCALE = 1;
    var RADIUS_SCALE_MIN = 1;
    var RADIUS_SCALE_MAX = 1;
    var QUANTITY = 40;
    var particles;
    var mouseX = 40;
    var mouseY = 50;
    var timeout = 0;
    var looping = 0;
    var erasingTotal = 3000;
    var erasingCounter = 0;
    var stopped = true;
    var overThumb = false;
    var prevMouseX, prevMouseY, len;

    // prototype holds methods (to save memory space)
    Frills.prototype = {


        validate: function() {
          // check that is a valid element and container
           if (!this.element) {
              throw "You need to set elements jQuery selector";
           }
        },

        appendCanvas: function() {
          this.canvas = document.createElement('canvas');
          this.canvas.id = "f-canvas";
          this.canvas.width = $(global).width();
          this.canvas.height = $(global).height();
          this.canvas.style.zIndex = 100;
          this.canvas.style.position = "fixed";
          this.canvas.style.margin = 0;
          this.canvas.style.padding = 0;
          this.canvas.style.left = 0;
          this.canvas.style.top = 0;
          this.canvas.style.pointerEvents = 'none';
          var body = document.getElementsByTagName("body")[0];
          body.appendChild(this.canvas);
          this.setUpCanvasSize();
          return this;
        },

        createContext: function() {
          if (this.canvas !== undefined) {
              context = this.canvas.getContext("2d");
          }
          return this;
        },

        createParticles: function() {
          particles = [];
          var n = 20;
          for (var o = 0; o < QUANTITY; o++) {
              var p = {
                  position: {
                      x: mouseX,
                      y: mouseY
                  },
                  shift: {
                      x: mouseX,
                      y: mouseY
                  },
                  size: 0.2,
                  angle: 0,
                  speed: 0.01 + Math.random() * 1,
                  targetSize: 0.2,
                  fillColor: "rgba(" + n + ", " + n + ", " + n + ", 1.0)",
                  orbit: this.radius * 0.5
              };
              particles.push(p);
          }
        },

        setUpCanvasSize: function() {
          this.canvas.width = global.innerWidth;
          this.canvas.height = global.innerHeight;
        },

        drawParticles: function() {
          RADIUS_SCALE = Math.min(RADIUS_SCALE, RADIUS_SCALE_MAX);
          context.globalCompositeOperation = 'destination-out';
          context.fillStyle = 'rgba(235,235,235,0.17)';
          context.fillRect(0, 0, context.canvas.width, context.canvas.height);
          if (stopped == true) {
              context.globalCompositeOperation = 'lighter';
              erasingCounter += 40;
              if (erasingCounter >= erasingTotal) {
                  clearInterval(looping);
                  looping = 0;
                  erasingCounter = 0
              }
              return
          };
          for (i = 0, len = particles.length; i < len; i++) {
              var o = particles[i];
              var n = {
                  x: o.position.x,
                  y: o.position.y
              };
              o.angle += o.speed;
              o.shift.x += (mouseX - o.shift.x) * (o.speed);
              o.shift.y += (mouseY - o.shift.y) * (o.speed);
              o.position.x = o.shift.x + Math.cos(i + o.angle) * (o.orbit * RADIUS_SCALE);
              o.position.y = o.shift.y + Math.sin(i + o.angle) * (o.orbit * RADIUS_SCALE);
              o.position.x = Math.max(Math.min(o.position.x, this.canvas.width), 0);
              o.position.y = Math.max(Math.min(o.position.y, this.canvas.height), 0);
              o.size += (o.targetSize - o.size) * 0.05;
              context.globalCompositeOperation = 'source-over';
              context.beginPath();
              context.fillStyle = o.fillColor;
              context.strokeStyle = o.fillColor;
              context.lineWidth = o.size;
              context.moveTo((0.5 + n.x) | 0, (0.5 + n.y) | 0);
              context.lineTo((0.5 + o.position.x) | 0, (0.5 + o.position.y) | 0);
              context.stroke();
              context.arc((0.5 + o.position.x) | 0, (0.5 + o.position.y) | 0, o.size / 2, 0, Math.PI * 2, true);
              context.fill();
          };
        },

        moveParticles: function() {
            stopped = false;
            if (looping <= 0 && overThumb) {
              looping = setInterval(this.drawParticles.bind(this), 40);
            }
            if (!overThumb) {
                stopped = true;
            }
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                stopped = true;
            }, 3000);
        },

        scrollCanvas: function() {
            stopped = true;
            var n = 0;
            clearInterval(looping);
            looping = 0;
            context.globalCompositeOperation = 'destination-out';
            context.fillStyle = 'rgba(239,239,239,1.0)';
            context.fillRect(0, 0, context.canvas.width, context.canvas.height);
            n++;
        },

        setUpEvents: function() {
          var self = this;
          document.addEventListener('mousemove', self.moveParticles.bind(this), false);
          window.addEventListener('resize', self.setUpCanvasSize, false);

          $(global).scroll(function () {
              overThumb = false;
              this.scrollCanvas();
          }.bind(this));

          this.element.mouseover(function () {
              overThumb = true;
              mouseX = $(this).offset().left + $(this).width() * 0.5;
              mouseY = $(this).offset().top - $(window).scrollTop() + $(this).height() * 0.5;
          });
          this.element.mouseout(function () {
              overThumb = false;
          });
        }

    };

    // the actual object is created here, allowing us to 'new' an object without calling 'new'
    Frills.init = function(options) {


        var self = this;
        self.element = options.element;
        self.radius = options.radius || options.element.width();
        console.log(self)

        self.validate();
        self.appendCanvas().createContext();
        this.createParticles();
        this.setUpEvents();

    }

    // trick borrowed from jQuery so we don't have to use the 'new' keyword
    Frills.init.prototype = Frills.prototype;

    // attach our Frills to the global object, and provide a shorthand '$F' for ease our poor fingers
    global.Frills = global.F$ = Frills;

}(window, jQuery));
