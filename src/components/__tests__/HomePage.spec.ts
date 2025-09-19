import { describe, it, expect } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'

import { mount } from '@vue/test-utils'
import HomePage from '../HomePage.vue'

describe('HomePage', () => {
  const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', component: { template: '<div />' } }
    ]
  })

  it('renders properly', async () => {
    const wrapper = mount(HomePage, {
      global: {
        plugins: [router]
      }
    })
    expect(wrapper.text()).toContain('Bienvenue sur la page d’accueil')
  })
})
