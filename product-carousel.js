(() => {
    const self = {};

    self.API_URL = "https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json";
    self.STORAGE_KEY = "favoriteProducts";
    self.PRODUCTS_KEY = "products";
    self.init = () => {

        if (!$('.product-detail').length) return;

        self.buildHTML();
        self.buildCSS();
        self.loadProducts();
        self.setEvents();
    };

    self.buildHTML = () => {
        const html = `

            <!-- TOP_BAR -->
            <div class="top-bar">
                <div class="container">
                    <a class="navbar-brand" href="#">
                        <img src="logo.png" alt="LC Waikiki" class="logo">
                    </a>
                    
                    <div class="search-container">
                        <form class="search-form" action="" method="GET">
                            <input type="search" name="q" placeholder="Ürün, kategori veya marka ara">
                            <button type="submit">Ara</button>
                        </form>
                    </div>

                    <div class="login">
                        <ul class="login-list">
                            <li><a href="#" class="text-white">Giriş Yap</a></li>
                            <li><a href="#" class="text-white">Favorilerim</a></li>
                            <li><a href="#" class="text-white">Sepetim</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <!-- "ŞUNU DA BEĞENEBİLİRSİNİZ" -->
            <div class="product-carousel">
                <h2 class="carousel-title">Şunu da Beğenebilirsiniz</h2>
                <div class="carousel-wrapper">
                    <button class="prev">❮</button>
                    <div class="carousel-track"></div>
                    <button class="next">❯</button>
                </div>
            </div>
        `;

        $('.product-detail').after(html);
    };

    self.buildCSS = () => {
        const css = `
            <style>
            
            .container {
                display: flex;
                align-items: center;
                justify-content: space-between;
                max-width: 1200px;
                width: 100%;
                margin: 0 auto;
                padding: 0 15px;
            }

            /* LOGO */
            .navbar-brand .logo {
                max-height: 150px; 
            }

            /* SEARCH */
            .search-container {
                flex: 1;               
                margin: 0 20px; 
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .search-form {
                position: relative;
                display: flex;
                align-items: center;
                width: 100%;
                max-width: 500px; 
            }

            .search-form input[type="search"] {
                width: 100%;
                padding: 10px 40px 10px 10px;
                border: 1px solid #ccc;
                border-radius: 20px;
                font-size: 14px;
            }

            .search-form button {
                position: absolute;
                right: 10px;
                top: 50%;
                transform: translateY(-50%);
                background: none;
                border: none;
                cursor: pointer;
                font-size: 14px;
                color: #333;
            }

            .search-form button:hover {
                color: #337ab7;
            }
            
            /* LOGIN LIST (GİRİŞ YAP/FAVORİLERİM/SEPETİM) */
            .login {
                display: flex;
                align-items: center;
            }

            .login-list {
                display: flex;
                list-style: none;
            }
            
            .login-list li {
                margin-left: 20px;
            }
            
            .login-list li a {
                color: ##337ab7;
                font-size: 14px;
                text-transform: uppercase;
            }
            
            /* PRODUCT CAROUSEL ("ŞUNLARI DA BEĞENEBİLİRSİNİZ") */
            .product-carousel {
                padding: 20px;
                overflow: hidden;
                max-width: 1200px;
                margin: 0 auto;
            }
            .carousel-title {
                font-size: 20px;
                margin-bottom: 15px;
                color: #555;
                font-family: 'Open Sans', sans-serif !important;
            }
            .carousel-wrapper {
                display: flex;
                align-items: center;
                position: relative;
            }
            .carousel-track {
                display: flex;
                overflow-x: auto;
                gap: 10px;
                scroll-behavior: smooth;
                width: 100%;
            }
  
            .carousel-track::-webkit-scrollbar {
                display: none;
            }
            .carousel-item {
                flex: 0 0 150px; 
                cursor: pointer;
                border: 1px solid #ddd;
                border-radius: 5px;
                text-align: center;
                padding: 10px;
                background-color: #fff;
                transition: box-shadow 0.3s;
            }
            .carousel-item:hover {
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .carousel-item img {
                max-width: 100%;
                height: auto;
                border-radius: 5px;
            }
            .carousel-item p {
                margin: 10px 0 5px;
                font-size: 14px;
                color: #333;
            }
            
            /* FAVORITE (KALP) */
            .fav {
                cursor: pointer;
                font-size: 16px;
                color: #aaa;
            }
            .fav.active {
                color: #337ab7; 
            }

            .prev, .next {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                margin: 0 5px;
            }
            .prev:hover, .next:hover {
                color: #337ab7;
            }

            @media(max-width: 768px) {
                .search input {
                    width: 100%;
                }
                .carousel-item {
                    flex: 0 0 120px;
                }
            }
            </style>
        `;
        $('head').append(css);
    };

    /* ÜRÜNLERİ LOCALSTORAGE'DAN veya API'DEN ALMA */
    self.loadProducts = async () => {
        let products = JSON.parse(localStorage.getItem(self.PRODUCTS_KEY));
        if (!products) {
            const response = await fetch(self.API_URL);
            products = await response.json();
            localStorage.setItem(self.PRODUCTS_KEY, JSON.stringify(products));
        }

        self.renderProducts(products);
    };

    self.renderProducts = (products) => {
        const track = $('.carousel-track');

        /* BURADA İLK 10 ÜRÜNÜ GÖSTERMEYİ TERCİH ETTİM */
        products.slice(0, 10).forEach(product => {
            track.append(`
                <div class="carousel-item" data-id="${product.id}">
                    <img src="${product.image}" alt="${product.name}">
                    <p>${product.name}</p>
                    <span class="fav">❤</span>
                </div>
            `);
        });

        /* SAYFA YÜKLENDİĞİNDE ÖNCEDEN FAVORİLERE EKLENEN ÜRÜNLERİN SEÇİLİ OLARAK GELMESİNİ SAĞLAR */
        self.loadFavorites();
    };

    /* FAVORİYE EKLENENLERİ LOCALSTORAGE'DAN YÜKLEYİP KLAPLERİ DOLDURUR */
    self.loadFavorites = () => {
        const favorites = JSON.parse(localStorage.getItem(self.STORAGE_KEY)) || [];
        favorites.forEach(favId => {
            $(`.carousel-item[data-id="${favId}"] .fav`).addClass('active');
        });
    };

    /*ÜRÜNLERİ SAĞA VE SOLA KAYDIRMA İŞLEMİ*/
    self.setEvents = () => {

        $(document).on('click', '.prev', () => {
            $('.carousel-track').animate({ scrollLeft: '-=160' }, 300);
        });

        $(document).on('click', '.next', () => {
            $('.carousel-track').animate({ scrollLeft: '+=160' }, 300);
        });

        /* FAVORİYE EKLEME (KALBE TIKLAMA) */
        $(document).on('click', '.fav', function(e) {

            e.stopPropagation();

            const itemId = $(this).closest('.carousel-item').data('id');
            let favorites = JSON.parse(localStorage.getItem(self.STORAGE_KEY)) || [];

            /*FAVORİLERDEYSE FAVORİLERDEN ÇIKARMA, FAVORİ DEĞİLSE FAVORİLERE EKLEME İŞLEMİ*/
            if (favorites.includes(itemId)) {
                favorites = favorites.filter(id => id !== itemId);
                $(this).removeClass('active');
            } else {
                favorites.push(itemId);
                $(this).addClass('active');
            }
            localStorage.setItem(self.STORAGE_KEY, JSON.stringify(favorites));
        });

        /* ÜRÜNE TIKLAYINCA ÜRÜNÜN YENİ SEKMEDE AÇILMASI */
        $(document).on('click', '.carousel-item', function(e) {
            const itemId = $(this).data('id');
            window.open(`https://www.MERVETOPRAKDAM.com/product/${itemId}`, '_blank');
        });
    };

    $(document).ready(self.init);

})();
