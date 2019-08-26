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
  zoom = 10;

  view: Projection = {
    center: { x: 0, y: 0 },
    zoom: 10
  };

  getViewArea(): ViewArea {
    return {
      vtl: { vx: -this.viewWidth / 2, vy: -this.viewHeight / 2 },
      vbr: { vx: -this.viewWidth / 2, vy: -this.viewHeight / 2 }
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
    const vx = (m.x - view.center.x) * view.zoom;
    const vy = (m.y - view.center.y) * view.zoom;
    return { vx, vy };
  }

  toMap(v: ViewCoord, view: Projection): MapCoord {
    const x = v.vx / view.zoom + view.center.x;
    const y = v.vx / view.zoom + view.center.x;
    return { x, y };
  }

  getMapArea(): MapArea {
    const v = this.getViewArea();
    return {
      tl: this.toMap(v.vtl, this.view),
      br: this.toMap(v.vbr, this.view)
    };
  }

  ngOnInit() {
  }

  getVisibleRows() {

  }


}
