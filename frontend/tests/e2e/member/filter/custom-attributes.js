export default () => {
  before(() => {
    cy.wait(1000);
  });

  beforeEach(() => {
    cy.scrollTo(0, 0);
    cy.server();
    cy.route('POST', '/api/tenant/*/member/query').as('apiMemberQuery');
  });

  after(() => {
    cy.scrollTo(0, 0);
  });

  it('Filters by each custom attribute', () => {
    cy.get('#filterList .custom-attribute').each((attribute) => {
      const attributeText = attribute.text().trim();
      const attributeName = attributeText.split(' ').map((text, textIndex) => {
        if (textIndex > 0) {
          return text.charAt(0).toUpperCase() + text.slice(1);
        }
        return text.toLowerCase();
      }).join('');
      cy.get('[data-qa="filter-dropdown"]').click();
      cy.wrap(attribute).click();
      cy.get('.filter-list-item-popper').then(($filter) => {
        if ($filter.find('.filter-type-select-multi').length > 0) {
          /** ***********\
           * SELECT-MULTI
           \************ */
          cy.get('[data-qa="filter-select-option"]').each((option) => {
            const optionText = option.text().trim();
            cy.wrap(option).click();
            cy.get('[data-qa="filter-apply"]').click();
            cy.wait(200);
            cy.wait('@apiMemberQuery');
            cy.get('@apiMemberQuery').then((req) => {
              const { rows } = req.response.body;
              rows.forEach((row) => {
                const value = row.attributes[attributeName].default;
                cy.wrap(value).should('include', optionText);
              });
            });
            cy.scrollTo(0, 0);
            cy.wait(200);
            cy.get('[data-qa="filter-list-chip"]').click({ force: true });
            cy.get('[data-qa="filter-list-chip"]').click({ force: true });
            cy.wrap(option).click();
          });
        } else if ($filter.find('.filter-type-boolean').length > 0) {
          /** ***********\
           * BOOLEAN
           \************ */
          cy.get('[data-qa="filter-boolean-true"]').click();
          cy.get('[data-qa="filter-apply"]').click();
          cy.wait(200);
          cy.wait('@apiMemberQuery');
          cy.get('@apiMemberQuery').then((req) => {
            const { rows } = req.response.body;
            rows.forEach((row) => {
              const value = row.attributes[attributeName].default;
              cy.wrap(value).should('eq', true);
            });
          });
          cy.scrollTo(0, 0);
          cy.wait(200);
          cy.get('[data-qa="filter-list-chip"]').click({ force: true });
          cy.get('[data-qa="filter-list-chip"]').click({ force: true });
          cy.get('[data-qa="filter-boolean-false"]').click();
          cy.get('[data-qa="filter-apply"]').click();
          cy.wait(200);
          cy.wait('@apiMemberQuery');
          cy.get('@apiMemberQuery').then((req) => {
            const { rows } = req.response.body;
            rows.forEach((row) => {
              const value = row.attributes[attributeName].default;
              cy.wrap(value).should('eq', false);
            });
          });
          cy.scrollTo(0, 0);
          cy.wait(200);
        } else if ($filter.find('.filter-type-number').length > 0) {
          /** ***********\
           * NUMBER
           \************ */
          cy.get('[data-qa="filter-number-from"]').type('{selectall}').type(3);

          cy.get('[data-qa="filter-apply"]').click();
          cy.wait('@apiMemberQuery');

          cy.get('@apiMemberQuery').then((req) => {
            const { rows } = req.response.body;
            rows.forEach((row) => {
              const value = row.attributes[attributeName].default;
              cy.wrap(+value).should('eq', 3);
            });
          });
          cy.get('[data-qa="filter-list-chip"]').click();
          cy.wait(100);
          cy.get('[data-qa="filter-list-chip"]').click();
          cy.get('.filter-list-item-popper [data-qa="filter-inline-select"]').click();
          cy.get('[data-qa="filter-inline-select-option"]').contains('<').click();

          cy.get('[data-qa="filter-apply"]').as('filterApply').click();
          cy.wait('@apiMemberQuery');

          cy.get('@apiMemberQuery').then((req) => {
            const { rows } = req.response.body;
            rows.forEach((row) => {
              const value = row.attributes[attributeName].default;
              cy.wrap(+value).should('be.lt', 3);
            });
          });

          cy.get('[data-qa="filter-list-chip"]').click();
          cy.wait(100);
          cy.get('[data-qa="filter-list-chip"]').click();
          cy.get('.filter-list-item-popper [data-qa="filter-inline-select"]').click();
          cy.get('[data-qa="filter-inline-select-option"]').contains('<=').click();

          cy.get('[data-qa="filter-apply"]').as('filterApply').click();
          cy.wait('@apiMemberQuery');

          cy.get('@apiMemberQuery').then((req) => {
            const { rows } = req.response.body;
            rows.forEach((row) => {
              const value = row.attributes[attributeName].default;
              cy.wrap(+value).should('be.lte', 3);
            });
          });

          cy.get('[data-qa="filter-list-chip"]').click();
          cy.wait(100);
          cy.get('[data-qa="filter-list-chip"]').click();
          cy.get('.filter-list-item-popper [data-qa="filter-inline-select"]').click();
          cy.get('[data-qa="filter-inline-select-option"]').contains('>').click();

          cy.get('[data-qa="filter-apply"]').as('filterApply').click();
          cy.wait('@apiMemberQuery');

          cy.get('@apiMemberQuery').then((req) => {
            const { rows } = req.response.body;
            rows.forEach((row) => {
              const value = row.attributes[attributeName].default;
              cy.wrap(+value).should('be.gt', 3);
            });
          });

          cy.get('[data-qa="filter-list-chip"]').click();
          cy.wait(100);
          cy.get('[data-qa="filter-list-chip"]').click();
          cy.get('.filter-list-item-popper [data-qa="filter-inline-select"]').click();
          cy.get('[data-qa="filter-inline-select-option"]').contains('>=').click();

          cy.get('[data-qa="filter-apply"]').as('filterApply').click();
          cy.wait('@apiMemberQuery');

          cy.get('@apiMemberQuery').then((req) => {
            const { rows } = req.response.body;
            rows.forEach((row) => {
              const value = row.attributes[attributeName].default;
              cy.wrap(+value).should('be.gte', 3);
            });
          });

          cy.get('[data-qa="filter-list-chip"]').click();
          cy.wait(100);
          cy.get('[data-qa="filter-list-chip"]').click();
          cy.get('.filter-list-item-popper [data-qa="filter-inline-select"]').click();
          cy.get('[data-qa="filter-inline-select-option"]').contains('between').click();
          cy.get('[data-qa="filter-number-from"]').type('{selectall}').type(2);
          cy.get('[data-qa="filter-apply"]').should('be.disabled');

          cy.get('[data-qa="filter-number-from"]').type('{selectall}').type(2);
          cy.get('[data-qa="filter-number-to"]').type('{selectall}').type(6);
          cy.get('[data-qa="filter-apply"]').as('filterApply').click();

          cy.wait('@apiMemberQuery');

          cy.get('@apiMemberQuery').then((req) => {
            const { rows } = req.response.body;
            rows.forEach((row) => {
              const value = row.attributes[attributeName].default;
              cy.wrap(+value).should('be.gte', 2);
              cy.wrap(+value).should('be.lte', 6);
            });
          });
        } else if ($filter.find('.filter-with-operator-and-input[default-operator="textContains"]').length > 0) {
          /** ***********\
           * STRING
           \************ */
          cy.get('.filter-with-operator-and-input input').clear().type('an');
          cy.get('.filter-list-item-popper [data-qa="filter-inline-select"]').click();
          cy.get('[data-qa="filter-inline-select-option"]').contains('contains').click();
          cy.get('[data-qa="filter-apply"]').click();
          cy.wait(200);
          cy.wait('@apiMemberQuery');
          cy.get('@apiMemberQuery').then((req) => {
            const { rows } = req.response.body;
            rows.forEach((row) => {
              const value = row.attributes[attributeName].default;
              cy.wrap(value).should('contain', 'an');
            });
          });
          cy.get('[data-qa="filter-list-chip"]').click();
          cy.wait(100);
          cy.get('[data-qa="filter-list-chip"]').click();
          cy.get('.filter-list-item-popper [data-qa="filter-inline-select"]').click();
          cy.get('[data-qa="filter-inline-select-option"]').contains('is').click();

          cy.get('[data-qa="filter-apply"]').click();
          cy.wait(200);
          cy.wait('@apiMemberQuery');
          cy.get('@apiMemberQuery').then((req) => {
            const { rows } = req.response.body;
            rows.forEach((row) => {
              const value = row.attributes[attributeName].default;
              cy.wrap(value).should('eq', 'an');
            });
          });
          cy.get('[data-qa="filter-list-chip"]').click();
          cy.wait(100);
          cy.get('[data-qa="filter-list-chip"]').click();
          cy.get('.filter-list-item-popper [data-qa="filter-inline-select"]').click();
          cy.get('[data-qa="filter-inline-select-option"]').contains('is not').click();

          cy.get('[data-qa="filter-apply"]').click();
          cy.wait(200);
          cy.wait('@apiMemberQuery');
          cy.get('@apiMemberQuery').then((req) => {
            const { rows } = req.response.body;
            rows.forEach((row) => {
              const value = row.attributes[attributeName].default;
              cy.wrap(value).should('not.eq', 'an');
            });
          });
          cy.get('[data-qa="filter-list-chip"]').click();
          cy.wait(100);
          cy.get('[data-qa="filter-list-chip"]').click();
          cy.get('.filter-list-item-popper [data-qa="filter-inline-select"]').click();
          cy.get('[data-qa="filter-inline-select-option"]').contains('not contains').click();

          cy.get('[data-qa="filter-apply"]').click();
          cy.wait(200);
          cy.wait('@apiMemberQuery');
          cy.get('@apiMemberQuery').then((req) => {
            const { rows } = req.response.body;
            rows.forEach((row) => {
              const value = row.attributes[attributeName].default;
              // cy.wrap(value).should('not.contain', 'an');
            });
          });
        } else {
          console.log(attributeText, 'none');
        }
      });

      cy.get('[data-qa="filter-list-chip-close"]').click({ force: true });
      cy.wait(1000);
    });
  });
};
