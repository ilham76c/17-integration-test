require("cypress-file-upload");

describe('Worker Page', () => {
  it('berhasil menampilkan halaman pekerja', () => {
    cy.visit('/worker.html');
  });  

  describe("Error di Worker Page", () => {
    beforeEach(() => {
      cy.intercept('/list', { fixture: 'list.json' }).as('getList');
      cy.intercept('/photo/gambar1.jpeg', { fixture: 'gambar1.jpeg' });
      cy.intercept('/photo/gambar2.jpeg', { fixture: 'gambar2.jpeg' });
    });

    it("Form isian tidak lengkap", () => {
      cy.get('#name').type('Albaresta');
      cy.get('#age').type('26');
      cy.get('#form').submit();     

      cy.get('#error-text').should('contain.text', 'form isian tidak lengkap!');
    });

    it("Gagal menghapus pekerja", () => {            
      cy.visit('/worker.html');  
      cy.wait('@getList');
      
      cy.contains('hapus').eq(0).click();
      cy.get('#error-text').should('contain.text', 'gagal menghapus pekerja');
    });    
  });
  
  // tes untuk menampilkan daftar pekerja path /list
  describe("Daftar Pekerja", () => {
    it("berhasil menampilkan daftar pekerja", () => {
      cy.intercept("/list", { fixture: 'list.json' }).as('getList');
      cy.visit('/worker.html');      
      cy.wait('@getList');
      cy.get("#list").children().as("workerList");
      
      cy.get("@workerList").should('have.length', 2);
    });
  });

  // tes untuk menambahkan profil pekerja baru /register
  describe("Menambahkan Pekerja Baru", () => {
    beforeEach(() => {
      cy.intercept('/list', { fixture: 'list.json' }).as('getList');
      cy.intercept('/photo/gambar1.jpeg', { fixture: 'gambar1.jpeg' });
      cy.intercept('/photo/gambar2.jpeg', { fixture: 'gambar2.jpeg' });
    });

    it("berhasil menambahkan profil pekerja baru", () => {
      cy.intercept("/register", { fixture: 'register.json' });
      cy.intercept('/photo/gambar3.jpeg', { fixture: 'gambar3.jpeg' });
      cy.visit('/worker.html');      
      cy.wait('@getList');

      cy.get('#name').type('Yosy');
      cy.get('#age').type('22');
      cy.get('#bio').type('Ini adalah bio dari Yosy');
      cy.get('#address').type('Jawa Timur');      
      cy.get('#photo').attachFile('gambar3.jpeg');
      cy.fixture('gambar3.jpeg').then(fileContent => {
        cy.get('#photo').attachFile({
            fileContent: 'fileContent.toString(',
            fileName: 'gambar3.jpeg',
            mimeType: 'image/jpeg'
        });
      });
      cy.get('#form').submit();      
      
      cy.get("#list").children().as("workerList");      
      cy.get("@workerList").should('have.length', 3);
    });
  });

});


