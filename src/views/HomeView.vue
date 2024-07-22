
<template>
  <div class="container my-5">
    <header class="bg-dark py-5 header-section">
      <div class="container px-5">
        <div class="row gx-5 justify-content-center">
          <div class="col-lg-6">
            <div class="text-center my-5">
              <h1 class="display-5 fw-bolder text-white mb-2">Descubre una nueva forma de jugar con Xbox Game Pass</h1>
              <p class="lead text-white-50 mb-4">Accede a una biblioteca en constante crecimiento de juegos de alta calidad con Xbox Game Pass. ¡Descubre, descarga y juega!</p>
              <div class="d-grid gap-3 d-sm-flex justify-content-sm-center">
                <a class="btn btn-primary btn-lg px-4 me-sm-3" href="#features" style="background-color: #107c10 !important; border-color: #107c10 !important;">Empezar</a>
                <a class="btn btn-outline-light btn-lg px-4" href="https://www.xbox.com/es-ES/xbox-game-pass#faq">Más información</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <section class="py-5 border-bottom" id="features">
      <div class="container px-5 my-5">
        <div class="row gx-5">
          <Feature
            icon="bi-controller"
            title="Acceso ilimitado a juegos"
            description="Explora una biblioteca con cientos de juegos para Xbox, PC y dispositivos móviles. Con Xbox Game Pass, siempre tendrás algo nuevo para jugar."
            linkText="Juega ahora"
          />
          <Feature
            title="Nuevos juegos agregados regularmente"
            description="Con Xbox Game Pass, siempre estarás al día con los últimos lanzamientos. Descubre nuevos juegos cada mes y juega antes que nadie."
            icon="bi-gift-fill"
            linkText="Explora nuevos juegos"
          />
          <Feature
            title="Descargas ilimitadas"
            description="Descarga tus juegos favoritos y juega sin conexión en cualquier momento y en cualquier lugar. Con Xbox Game Pass, la diversión nunca se detiene."
            icon="bi-cloud-download-fill"
            linkText="Descubre más"
          />
        </div>
      </div>
    </section>

    <section class="bg-light py-5 border-bottom">
    <div class="container px-md-5 my-5">
      <div class="text-center mb-5">
        <h2 class="fw-bolder">Elige tu suscripción</h2>
        <p class="lead mb-0">Accede a Xbox Game Pass con nuestras opciones de suscripción flexibles</p>
      </div>
      <div class="row gx-md-5 justify-content-center">
        <SubscriptionCard
          icon="bi-laptop text-info"
          title="PC"
          price="$9.99"
          :items="[
            '1 usuario',
            'Cientos de juegos de alta calidad en PC',
            'Nuevos juegos en día de lanzamiento',
            'Descuentos y ofertas exclusivas',
            'Membresía de EA Play'
          ]"
          link="/Home/Planes"
        />
        <SubscriptionCard
          icon="bi-controller text-info"
          title="Core"
          price="$9.99"
          :items="[
            '1 usuario',
            'Multijugador online en consola',
            'Catálogo de más de 25 juegos',
            'Descuentos y ofertas exclusivas'
          ]"
          link="/Home/Planes"
        />
        <SubscriptionCard
          icon="bi-star-fill text-warning"
          title="Ultimate"
          price="$16.99"
          :items="[
            '1 usuario',
            'Cientos de juegos de alta calidad en consola, PC y la nube',
            'Nuevos juegos en día de lanzamiento',
            'Descuentos, ofertas y ventajas exclusivas',
            'Multijugador online en consola',
            'Membresía de EA Play'
          ]"
          link="/Home/Planes"
        />
      </div>
    </div>
  </section>

    <section class="py-5 border-bottom">
      <div class="container px-5 my-5 px-5">
        <div class="text-center mb-5">
          <h2 class="fw-bolder">Reseñas de usuarios</h2>
          <p class="lead mb-0">Nuestros usuarios adoran Xbox Game Pass</p>
        </div>
        <div class="row gx-5 justify-content-center">
          <div class="col-lg-6">
            <Review
              text="Game Pass es lo mejor que le ha pasado a la industria de los videojuegos. Lástima que tanta gente en nuestro país se aferre a la marca de Sony como si le debiesen parte de su vida y no se den la oportunidad de probar un sistema que da horas y horas de diversión por muy poco dinero. Allá cada cual."
              author="Enrique, España"
            />
            <Review
              text="El mejor servicio de la historia de los videojuegos. Algo simplemente increíble. Impensable hace apenas unos años. 2000% recomendable. Si te gustan los videojuegos tienes que suscribirte si o si."
              author="Marcos, México"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import Feature from '../components/Feature.vue'
import SubscriptionCard from '../components/SubscriptionCard.vue'
import Review from '../components/Review.vue'
</script>

<script lang="ts">
// import TheWelcome from '../components/TheWelcome.vue'

export default {
  components: {
    Feature,
    SubscriptionCard,
    Review,
  },
}
</script>

<style>
.header-section {
  background-image: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://fvelasco.neocities.org/images/xbox2.jpg');
  background-size: cover;
  background-position: center;
}

.feature {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 4rem;
  width: 4rem;
  font-size: 2rem;
}

</style>

