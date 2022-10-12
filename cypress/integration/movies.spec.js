describe("movies test", () => {
  beforeEach(() => {
    cy.login('test1@hotmail.com', '12345678');
  });

  it("show movies", () => {
    cy.intercept(
      "GET",
      "http://localhost:9000/api/movies",
      { fixture: "movies.json" }
    );

    cy.visit("http://localhost:3000/movies");
    cy.get("[data-cy=movie]").should("have.length", 1);
    cy.get("[data-cy=movie_title]").eq(0).contains("Alita Battle Angel");
    cy.get("[data-cy=movie_releaseYear]").eq(0).contains(2019);
    cy.get("[data-cy=movie_synopsis]").eq(0).contains("A deactivated cyborg's revived, but can't remember anything of her past and goes on a quest to find out who she is.");
    cy.get("[data-cy=movie_imdbLink]").eq(0).should("attr", "href", "https://www.imdb.com/title/tt0437086/");
  });

  it("very slow response", () => {
    cy.intercept(
      "http://localhost:9000/api/movies",
      (req) => {
        req.on("response", (res) => {
          res.setDelay(1000);
        });
      }
    ).as("slowResponse");
    cy.visit("http://localhost:3000/movies");
    cy.get("[data-cy=movie_loading]").should("be.visible");
    cy.wait("@slowResponse");
    cy.get("[data-cy=loading]").should("not.exist");
  });

  it("check filter", () => {
    cy.visit("http://localhost:3000/movies");
    cy.get("[data-cy=movies_search_txtfield]").type("Star");
    cy.get("[data-cy=movies_search_btn]").click();
    cy.get("[data-cy=movie]").should("have.length", 2);
    cy.get("[data-cy=movie_title]").each((ec) => {
      const text = ec.text();
      expect(text).to.match(/Star/);
    });
  });

  it("check empty filter", () => {
    cy.visit("http://localhost:3000/movies");
    cy.get("[data-cy=movies_search_txtfield]").type("xyz");
    cy.get("[data-cy=movies_search_btn]").click();
    cy.get("[data-cy=movie]").should("have.length", 0);
    cy.get("[data-cy=movies_error]").should("not.exist");
  });

  it("error from backend", () => {
    cy.intercept(
      "GET",
      "http://localhost:9000/api/movies",
      { statusCode: 500, body: { error: "internal server error" } }
    );
    
    cy.visit("http://localhost:3000/movies");
    cy.get("[data-cy=movies_search_txtfield]").type("Star");
    cy.get("[data-cy=movies_search_btn]").click();
    cy.get("[data-cy=error_message]").should("be.visible");
  });
})