// пример многоугольников
var examples = {
  first: [
    { x: 60,  y: 60  },
    { x: 180, y: 0   },
    { x: 300, y: 60  },
    { x: 300, y: 300 },
    { x: 240, y: 180 },
    { x: 210, y: 180 },
    { x: 180, y: 240 },
    { x: 150, y: 180 },
    { x: 120, y: 180 },
    { x: 60,  y: 300 },
  ],
  second: [
    { x: 30,  y: 240 },
    { x: 330, y: 240 },
    { x: 330, y: 210 },
    { x: 270, y: 90  },
    { x: 210, y: 270 },
    { x: 210, y: 90  },
    { x: 180, y: 60  },
    { x: 150, y: 90  },
    { x: 150, y: 270 },
    { x: 90,  y: 90  },
    { x: 30,  y: 210 }
  ]

};
var test = {
   first: [
    { x: 88,  y: 316  },
    { x: 13, y: 372   },
    { x: 101, y: 118  },
    { x: 200, y: 260 },
    { x: 287, y: 118 },
    { x: 387, y: 372 },
    { x: 278, y: 316 },
    { x: 204, y: 392 }
  ],
  second: [
    { x: 6,  y: 104 },
    { x: 57, y: 380 },
    { x: 330, y: 210 },
    { x: 342, y: 377  },
    { x: 388, y: 106 },
    { x: 235, y: 264 },
    { x: 204, y: 24  },
    { x: 204, y: 264  }   
  ]

};
function drawPath(data, container, color) {
  var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  var str = 'M' + data[0].x + ',' + data[0].y+' ';
  str += data.slice(1).map(function (point) {
    return 'L' + point.x + ',' + point.y;
  }).join(' ');
  str += 'L' + data[0].x + ',' + data[0].y+' ';
  path.setAttribute('d', str);
  path.style.fill = color;
  container.appendChild(path);
}
function drawPoint(data, container,color) {
 var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttributeNS(null, "cx", data.x);
  circle.setAttributeNS(null, "cy", data.y);
  circle.setAttributeNS(null, "r",  5);
  circle.setAttributeNS(null, "fill", color);
  container.appendChild(circle);
}
drawPath(examples.first, document.querySelector('svg.base'), 'navy');
drawPath(examples.second, document.querySelector('svg.base'), 'yellow');


intersect(examples.first, examples.second).forEach(function (p) {
  drawPath(p, document.querySelector('svg.intersections'), 'red');
})

