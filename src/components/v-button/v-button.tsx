import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'v-button',
  styleUrl: 'v-button.scss',
  shadow: true,
})
export class VButton {

  render() {
    return (
      <Host>
        <div class="v-button">
          <span class="v-button-label"><slot></slot></span>
        </div>
      </Host>
    );
  }

}
