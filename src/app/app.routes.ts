import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'cube', loadComponent: () => import('./components/cube/cube.component').then(mod => mod.CubeComponent) }
];
