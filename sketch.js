let song;
let fft;
let numBars = 128;

let radiusSlider;
let weightSlider;

function preload() {
  song = loadSound("sample-visualisation.mp3");
}

function setup() {
  createCanvas(800, 800);
  fft = new p5.FFT(0.8, numBars);
  song.connect(fft);
  colorMode(HSB, 255);

  // slider Bar
  radiusSlider = createSlider(50, min(width, height) / 2, min(width, height) / 4, 1);
  radiusSlider.position(10, 10);
  createP('Radius').position(10, 10).style('color','red');

  weightSlider = createSlider(1, 10, 2, 0.1);
  weightSlider.position(10, 50);
  createP('LineWidth').position(10, 50).style('color','red');
}

function draw() {
  background(0);

  if (getAudioContext().state !== 'running') {
    fill(255);
    textAlign(CENTER, CENTER);
    text('Click to play Music', width / 2, height / 2);
    return;
  }

  let spectrum = fft.analyze();
  
  //Set the radius of Circle
  let radius = radiusSlider.value();
  let len = spectrum.length;
  let gap = TWO_PI / len;


  //Set the Weight of line
  strokeWeight(weightSlider.value());
  
  for (let i = 0; i < len; i++) {
    let amp = spectrum[i];
    let offset = map(amp, 0, 255, 0, 150);
    
    let hueValue = i * (255 / len);
    stroke(hueValue, 255, 255);
    noFill();
    
    let x1 = width / 2 + radius * cos(i * gap);
    let y1 = height / 2 + radius * sin(i * gap);
    let x2 = width / 2 + (radius + offset) * cos(i * gap);
    let y2 = height / 2 + (radius + offset) * sin(i * gap);
    line(x1, y1, x2, y2);
  }


//The Spectral Centroid
// The highest frequency measured in the FFT (e.g., sample_rate / 2)
let nyquist = 22050;

// get the centroid
spectralCentroid = fft.getCentroid();

// The mean_freq_index calculation is for the display.
let mean_freq_index = spectralCentroid / (nyquist / spectrum.length);

// Use a log scale to match the energy per octave in the FFT display
centroidplot = map(log(mean_freq_index), 0, log(spectrum.length), 0, width);

stroke(255, 0, 0);

// Adjusted coordinates to place the rectangle at the top right corner
rect(width - centroidplot - width / spectrum.length, 0, width / spectrum.length, height);
noStroke();
fill(255, 255, 255);

text('centroid: ', width - 100, 20); 
text(round(spectralCentroid) + ' Hz', width - 100, 40);


  
}

function mousePressed() {
  if (song.isPlaying()) {
    song.stop();
  } else {
    song.play();
  }
}



