import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by">
      Power by <strong><a target="_blank" href="https://www.afrilandfirstbank.com">Afriland First Bank</a></strong>
    </span>
  `,
})
export class FooterComponent {
}
