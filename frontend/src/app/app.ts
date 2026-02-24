import { Component } from '@angular/core';
import { RouterOutlet, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { FooterComponent } from './footer/footer';
import { HeaderComponent } from './header/header';
import { ToastComponent } from './components/toast/toast';
import { CommonModule } from '@angular/common';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, ToastComponent, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = '360Logz';
  showLayout = true;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let current = this.route;
          while (current.firstChild) {
            current = current.firstChild;
          }
          return current.snapshot.data['showLayout'] !== false;
        })
      )
      .subscribe((showLayout) => {
        this.showLayout = showLayout;
      });
  }

  get isAdminRoute(): boolean {
    return this.router.url.startsWith('/admin');
  }
}
