import { MeanContactlistAngular2Page } from './app.po';

describe('HackermansOutbreak App', () => {
  let page: MeanContactlistAngular2Page;

  beforeEach(() => {
    page = new MeanContactlistAngular2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
