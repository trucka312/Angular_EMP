import { ComponentRef } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  DetachedRouteHandle,
  RouteReuseStrategy,
} from '@angular/router';

export class CustomRouteReuseStrategy implements RouteReuseStrategy {
  routesToCache: string[] = [
    'user/list',
    'user/detail',
    'user/edit',
    'user/add',
  ];
  private storedRoutes = new Map<string, DetachedRouteHandle>();

  shouldReuseRoute(
    future: ActivatedRouteSnapshot,
    curr: ActivatedRouteSnapshot
  ): boolean {
    return future.routeConfig === curr.routeConfig;
  }

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return this.routesToCache.includes(route.routeConfig?.path!);
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    this.storedRoutes.set(route.routeConfig!.path!, handle);
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return !!this.storedRoutes.get(route.routeConfig!.path!);
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    return this.storedRoutes.get(route.routeConfig!.path!) || null;
  }

  clearRoute(fullPath: string) {
    const handle = this.storedRoutes.get(fullPath);
    this.destroyComponent(handle);
    this.storedRoutes.delete(fullPath);
  }

  private destroyComponent(handle: DetachedRouteHandle | any): void {
    const componentRef: ComponentRef<any> = handle && handle['componentRef'];
    if (componentRef) {
      componentRef.destroy();
    }
  }
}
