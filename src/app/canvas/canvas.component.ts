import { Component, OnInit } from '@angular/core';

interface Field {
  type: string;
}
interface MapCoord {
  x: number;
  y: number;
}
interface ViewCoord {
  vx: number;
  vy: number;
}
interface Projection {
  center: MapCoord;
  zoom: number;
}
interface MapArea {
  tl: MapCoord;
  br: MapCoord;
}
interface ViewArea {
  vtl: ViewCoord;
  vbr: ViewCoord;
}
interface MapInterval {
  start: number;
  end: number;
}

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit {

  mapSize = 100;
  map: Field[][] = [];

  viewHeight = 300;
  viewWidth = 300;

  fieldSize = 20;

  view: Projection = {
    center: { x: 0, y: 0 },
    zoom: 1
  };

  canvas: HTMLElement;

  previousArea: MapArea = {
    tl: {x: 0, y: 0},
    br: {x: 0, y: 0}
  };

  getViewArea(): ViewArea {
    return {
      vtl: { vx: -this.viewWidth / 2, vy: -this.viewHeight / 2 },
      vbr: { vx: +this.viewWidth / 2, vy: +this.viewHeight / 2 }
    };
  }

  constructor(
  ) {
    this.map = [];
    for (let x = 0; x < this.mapSize; x++) {
      this.map[x] = [];
      for (let y = 0; y < this.mapSize; y++) {
        this.map[x][y] = { type: 'ground' };
      }
    }
  }

  toView(m: MapCoord, view: Projection): ViewCoord {
    const vx = (m.x - view.center.x) * this.fieldSize;
    const vy = (m.y - view.center.y) * this.fieldSize;
    return { vx, vy };
  }

  toMap(v: ViewCoord, view: Projection): MapCoord {
    const x = Math.floor(v.vx / this.fieldSize + view.center.x);
    const y = Math.floor(v.vx / this.fieldSize + view.center.x);
    return { x, y };
  }

  getMapArea(): MapArea {
    const v = this.getViewArea();
    return {
      tl: this.toMap(v.vtl, this.view),
      br: this.toMap(v.vbr, this.view)
    };
  }

  getVerticalInterval( area: MapArea): MapInterval {
    return { start: area.tl.y, end: area.br.y };
  }
  updateInterval( current: MapInterval, previous: MapInterval, container: HTMLElement, elementFactory: (index: number) => HTMLElement) {

    // remove elements
    for (let i = previous.end - current.end; i > 0; i--) {
      container.children.item(i).remove();
    }
    for (let i = 0; i < current.start - previous.start; i++) {
      container.children.item(i).remove();
    }

    // add elements
    if (current.start < previous.start) {
      const elements: HTMLElement[] = [];
      for (let c = current.start; c < previous.start; c++) {
        elements.push( elementFactory(c) );
      }
      container.prepend(...elements);
    }

    if (current.end > previous.end) {
      const elements: HTMLElement[] = [];
      for (let c = previous.end; c < current.end; c++) {
        elements.push( elementFactory(c) );
      }
      container.append(...elements);
    }
  }

  createRow = ( rowIndex: number): HTMLElement => {
    const e = document.createElement('div');
    e.append('' + rowIndex);
    e.classList.add('field');
    const x = this.viewWidth / 2;
    const y = this.viewHeight / 2 + rowIndex * this.fieldSize;
    e.style.left = `${x}px`;
    e.style.top = `${y}px`;
    e.style.width = `${this.fieldSize}px`;
    e.style.height = `${this.fieldSize}px`;
    return e;
  }

  draw() {
    const mapArea = this.getMapArea();
    const currentRows = this.getVerticalInterval(mapArea);
    const previousRows = this.getVerticalInterval(this.previousArea);

    this.updateInterval( currentRows, previousRows, this.canvas, this.createRow );

    this.previousArea = mapArea;
  }

  ngOnInit() {
    this.canvas = document.getElementById('canvas');

    this.draw();
  }

  getVisibleRows() {

  }


}
