<template>
    <div class="container my-5">
      <section class="bg-light py-5">
        <div class="container px-5 my-5">
          <div class="text-center mb-5" style="text-align: center !important;">
            <div class="feature bg-success bg-gradient text-white rounded-3 mb-3"><i class="fab fa-xbox"></i></div>
            <h2 class="fw-bolder">Contacta con nosotros</h2>
            <p class="lead mb-0">Nos encantaría saber de ti</p>
          </div>
          <div class="row justify-content-center">
            <div class="col-lg-10 d-flex flex-column align-items-center text-center" style="justify-content: center !important;">
              <form @submit.prevent="submitForm" id="contactForm">
                <!-- Name input-->
                <div class="form-floating mb-3">
                  <input v-model="formData.name" class="form-control" id="name" type="text" placeholder="Enter your name..." />
                  <label for="name">Nombre completo</label>
                  <div class="invalid-feedback" v-if="errors.name">Se requiere un nombre.</div>
                </div>
                <!-- Email address input-->
                <div class="form-floating mb-3">
                  <input v-model="formData.email" class="form-control" id="email" type="email" placeholder="name@example.com" />
                  <label for="email">Correo electrónico</label>
                  <div class="invalid-feedback" v-if="errors.email_required">Se requiere un correo electrónico.</div>
                  <div class="invalid-feedback" v-if="errors.email_email">Correo electrónico no es válido.</div>
                </div>
                <!-- Phone number input-->
                <div class="form-floating mb-3">
                  <input v-model="formData.phone" class="form-control" id="phone" type="tel" placeholder="(123) 456-7890" />
                  <label for="phone">Número de teléfono</label>
                  <div class="invalid-feedback" v-if="errors.phone">Se requiere un teléfono.</div>
                </div>
                <!-- Message input-->
                <div class="form-floating mb-3">
                  <textarea v-model="formData.message" class="form-control" id="message" type="text" placeholder="Enter your message here..." style="height: 10rem"></textarea>
                  <label for="message">Mensaje</label>
                  <div class="invalid-feedback" v-if="errors.message">Se requiere un mensaje.</div>
                </div>
                <!-- Submit Button-->
                <div class="d-grid"><button class="btn btn-primary btn-lg" id="submitButton" type="submit">Enviar</button></div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        formData: {
          name: '',
          email: '',
          phone: '',
          message: ''
        },
        errors: {}
      };
    },
    methods: {
      submitForm() {
        // Validación de campos
        this.errors = {};
        if (!this.formData.name) {
          this.errors.name = true;
        }
        if (!this.formData.email) {
          this.errors.email_required = true;
        } else if (!this.validateEmail(this.formData.email)) {
          this.errors.email_email = true;
        }
        if (!this.formData.phone) {
          this.errors.phone = true;
        }
        if (!this.formData.message) {
          this.errors.message = true;
        }
  
        // Si no hay errores, enviar formulario
        if (Object.keys(this.errors).length === 0) {
          console.log('Formulario enviado:', this.formData);
          // Aquí podrías enviar los datos del formulario al servidor o realizar otra acción
        }
      },
      validateEmail(email) {
        // Validación simple de dirección de correo electrónico
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
      }
    }
  };
  </script>
  