// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useSettingsStore } from '../stores/useSettingsStore';
import { useSiteStore } from '../stores/useSiteStore';
import { makeTestSite } from '../test-utils/makeTestSite';
import { FabPopover } from './FabPopover';

const sites = [
  makeTestSite({ id: 'site-a', name: 'Gokcekaya PDHES', order: 1, capacityMW: 1400, energyGWh: 9.8, headM: 380 }),
  makeTestSite({ id: 'site-b', name: 'Very Long Candidate Name That Should Wrap Instead Of Expanding The Table PDHES', order: 2 }),
];

function renderFabPopover() {
  return render(
    <FabPopover
      mapStyle="satellite"
      setMapStyle={vi.fn()}
      terrain3d={false}
      setTerrain3d={vi.fn()}
      heightScale={1.1}
      setHeightScale={vi.fn()}
      selectedSiteId="site-a"
      selectSite={vi.fn()}
    />,
  );
}

describe('FabPopover UI contract', () => {
  beforeEach(() => {
    useSiteStore.setState({
      sites,
      selectedId: 'site-a',
      setWorldExampleFocus: vi.fn(),
    });
    useSettingsStore.setState({ mapStyle: 'satellite', heightScale: 1.1, showPowerGrid: false });
  });

  afterEach(cleanup);

  it('uses tab semantics and fixed table columns for compact map popover lists', () => {
    renderFabPopover();

    fireEvent.click(screen.getByRole('button', { name: /Men/i }));

    const tabList = screen.getByRole('tablist');
    const candidateTab = within(tabList).getByRole('tab', { name: /Adaylar/i });
    const worldTab = document.getElementById('fab-tab-world');
    expect(candidateTab.getAttribute('aria-selected')).toBe('true');
    expect(worldTab?.getAttribute('role')).toBe('tab');
    expect(worldTab?.getAttribute('aria-selected')).toBe('false');

    const table = screen.getByRole('table');
    const columnWidths = Array.from(table.querySelectorAll('col')).map((col) => col.getAttribute('style'));
    expect(columnWidths).toEqual(['width: 60%;', 'width: 20%;', 'width: 20%;']);

    const visibleHeader = document.querySelector('#fab-panel-candidates .fab-table-head');
    const scrollArea = document.querySelector('#fab-panel-candidates .fab-table-scroll');
    expect(visibleHeader?.getAttribute('aria-hidden')).toBe('true');
    expect(scrollArea?.querySelector('.fab-table')).toBe(table);

    const headerColumns = Array.from(visibleHeader?.querySelectorAll('.fab-table-head-cell') ?? []).map((cell) => cell.textContent);
    expect(headerColumns).toEqual(['Aday Adı', 'Güç / Enerji', 'Düşü / Su Yolu']);
  });

  it('keeps the world examples header outside the scrolling table body', () => {
    renderFabPopover();

    fireEvent.click(screen.getByRole('button', { name: /Men/i }));
    fireEvent.click(document.getElementById('fab-tab-world')!);

    const panel = document.getElementById('fab-panel-world');
    const visibleHeader = panel?.querySelector('.fab-table-head');
    const scrollArea = panel?.querySelector('.fab-table-scroll');
    const table = within(panel as HTMLElement).getByRole('table');

    expect(visibleHeader?.getAttribute('aria-hidden')).toBe('true');
    expect(scrollArea?.querySelector('.fab-table')).toBe(table);
    expect(table.querySelector('thead')?.className).toContain('visually-hidden');

    const headerColumns = Array.from(visibleHeader?.querySelectorAll('.fab-table-head-cell') ?? []).map((cell) => cell.textContent);
    expect(headerColumns).toEqual(['Tesis Adı', 'Güç / Enerji', 'Düşü / Verim (%)']);
  });
});
