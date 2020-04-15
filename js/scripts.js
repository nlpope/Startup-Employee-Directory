$(function () {
  const usersUrl = "https://randomuser.me/api/?results=12&nat=US";
  let searchBar = "";
  let card = "";
  let modalCard = "";
  // ------------------------------------------
  //  FETCH FUNCTIONS
  // ------------------------------------------
  /**
   * Fetches users, converts response to JSON, then appends DOM elements
   * containing each user's info
   */
  (function ($) {
    $.fn.fetchUsers = function ($url) {
      fetch($url)
        .then((response) => response.json())
        .then(function (data) {
          let userArray = data.results;
          let i = 0;
          //create and append search bar
          $(this).createSearchBar();
          //for each user, create a card. Add an index id for 'modalCard' build
          $(userArray).each(function () {
            card = `
                    <div id='${i}' class="card bounceIn">
                        <div class="card-img-container">
                            <img class="card-img" src=${this.picture.large} alt="profile picture">
                        </div>
                        <div class="card-info-container">
                            <h3 id="name" class="card-name cap">${this.name.first} ${this.name.last}</h3>
                            <p class="card-text">${this.email}</p>
                            <p class="card-text cap">${this.location.city}, ${this.location.state}</p>
                        </div>
                    </div>
                    `;
            i++;
            //append the card to the DOM
            $(".gallery").append(card);
          });
          //add click functionality. Pass fetched array at index marked by card's id
          //also passing index and userArray to help with modal creation and toggle buttons respectively
          $(".card").on("click", function (e) {
            let numericIndex = parseInt(e.currentTarget.id);
            $(this).makeModal(userArray[numericIndex], numericIndex, userArray);
          });
        });
    };
  })(jQuery);

  // ------------------------------------------
  //  HELPER FUNCTIONS
  // ------------------------------------------
  /**
   * Creates a search bar to filter results
   */
  (function ($) {
    $.fn.createSearchBar = function () {
      searchBar = `
            <form id="search-names" action="#" method="get" class="bounceIn">
                <input type="text" id="search-input" class="search-input" placeholder="Search...">
                <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
            </form>
            `;
      $(".search-container").append(searchBar);
      $("#search-input").on("keyup", function (e) {
        const term = e.target.value.toLowerCase();
        $(".card-info-container h3").each(function (index, name) {
          const person = `${name.textContent}`;
          if (person.toLowerCase().indexOf(term) != -1) {
            $(name).parent().parent().show();
          } else {
            $(name).parent().parent().css("display", "none");
          }
        });
      });
    };
  })(jQuery);

  /**
   * Creates a modal card to display using data fetched in fn.fetchUsers
   */

  (function ($) {
    $.fn.makeModal = function (data, index, userArray) {
      modalCard = `
            <div class="modal-container">
              <div class="modal-backdrop"></div>
                <div class="modal bounceIn">
                    <button type="button" id="modal-close-btn" class="modal-close-btn">&times</button>
                    <div class="modal-info-container">
                        <img class="modal-img" src=${
                          data.picture.large
                        } alt="profile picture">
                        <h3 id="name" class="modal-name cap">${
                          data.name.first
                        } ${data.name.last}</h3>
                        <p class="modal-text">${data.email}</p>
                        <p class="modal-text cap">${data.location.city}</p>
                        <hr>
                        <p class="modal-text">${this.formatPhone(data.cell)}</p>
                        <p class="modal-text">${data.location.street.number} ${
        data.location.street.name
      }, ${data.location.city}, ${data.location.state} ${
        data.location.postcode
      }</p>
                        <p class="modal-text">Birthday: ${this.formatBday(
                          data.dob.date
                        )}</p>
                    </div>
                </div>
                <div class="modal-btn-container">
                    <button type="button" id="modal-prev" class="modal-prev btn bounceIn">Prev</button>
                    <button type="button" id="modal-next" class="modal-next btn bounceIn">Next</button>
                </div>
                
            </div>,
            `;
      //append modal
      $(modalCard).insertAfter($(".gallery"));
      //give 'X' button modal close function
      $(".modal-close-btn").on("click", function () {
        $(this).parent().parent().remove();
      });
      //give backdrop modal close function
      $(".modal-backdrop").on("click", function () {
        $(this).parent().remove();
      });
      //give toggle buttons function
      $(".modal-prev").on("click", function () {
        if (userArray[index - 1] === undefined) {
          $(".modal-container").remove();
        } else {
          $(".modal-container").remove();
          $(this).makeModal(userArray[index - 1], index - 1, userArray);
        }
      });
      $(".modal-next").on("click", function () {
        if (userArray[index + 1] === undefined) {
          $(".modal-container").remove();
        } else {
          $(".modal-container").remove();
          $(this).makeModal(userArray[index + 1], index + 1, userArray);
        }
      });
    };
  })(jQuery);

  /**
   * Formats phone number passed to match (555) 555-5555
   * @return {string} A string of numbers matching the above case
   */
  (function ($) {
    $.fn.formatPhone = function (data) {
      const newString = data
        .replace(/[^\d]/g, "")
        .replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
      return newString;
    };
  })(jQuery);

  /**
   * Formats D.O.B. passed to match mm/dd/yyyy
   * @return {string} A string of numbers matching the above case
   */
  (function ($) {
    $.fn.formatBday = function (data) {
      let newString = "";
      let tmp;
      let i = 10;
      let j = 0;
      while (i) {
        newString += data[j];
        i--;
        j++;
      }
      //creates mm/dd/yyyy format by swapping array elements
      newString = newString.split("-").reverse();
      tmp = newString[0];
      newString[0] = newString[1];
      newString[1] = tmp;
      newString = newString.join("/");
      return newString;
    };
  })(jQuery);

  $(this).fetchUsers(usersUrl);
});

/**
 * NOTES:
 * 1. With each 'card' generated in fn.fetchUsers, I added an index id to help fn.makeModal know what data to build with
 */
