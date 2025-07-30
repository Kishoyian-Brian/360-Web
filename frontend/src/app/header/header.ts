import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent {
  cartItemCount: number = 0;

  toggleCart(): void {
    // TODO: Implement cart toggle functionality
    console.log('Toggle cart clicked');
  }
}
