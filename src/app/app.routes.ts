import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'cube', loadChildren: () => import('./components/cube/cube.component').then(mod => mod.CubeComponent) }
];
