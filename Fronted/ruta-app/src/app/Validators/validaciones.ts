/* Validaciones
 * dni comprueba si es un dni
    esAnterior(fehca:Date) comprueba si la fecha es anterior a la fecha pasada
 */

import { AbstractControl, ValidationErrors } from '@angular/forms';

export  class validaciones{


  /**
   * Funcion que valida el contenoido de la caja de texto de email y lanza un errror cuando no esta completo o no es un email
   */

   public static email(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const valid = emailRegex.test(control.value);
    return valid ? null : { emailInvalido: 'Email inválido' };
  }

  /**
   * Funcion que valida si el email ya existe en la lista de usuarios
   */
  public static emailRepetido(lista: any[], nombreCampo: string) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const existe = lista.some(item => 
        // Usamos corchetes [nombreCampo] para acceder a la propiedad dinámicamente
        item[nombreCampo]?.trim().toUpperCase() === control.value.trim().toUpperCase()
      );

      return existe ? { emailDuplicado: true } : null;
    };
  }

  /**
   * Funcion que valida el contenido de una caja de texto de la contrseña y lanza un error cuando su contenido no sea de 6 caracteres y entre ellos una letra
   * 
   */
  public static contrasena(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }
  // Explicación: 
  // (?=.*[a-zA-Z]) -> Asegura que haya al menos una letra
  // [a-zA-Z0-9]{6,} -> Asegura al menos 6 caracteres alfanuméricos
  const contrasenaRegex = /^(?=.*[a-zA-Z])[a-zA-Z0-9]{6,}$/;
  const valid = contrasenaRegex.test(control.value);
  return valid ? null : { contraseñaInvalida: true };
  }

    /**
     * Funcion que valida el contenido de una caja de texto y lanza un error
     * cuando su contenido no es un DNI
     */


    public static dni(control: AbstractControl): ValidationErrors | null {
    
      if (!control.value){
        return null; //Si el campo esta vacio no se valida
      }

    let error=true;
    if (parseInt(control.value)){
      let numero = parseInt(control.value);
      let letra = control.value[control.value.length-1];
      if ("TRWAGMYFPDXBNJZSQVHLCKE" [numero%23]==letra){
        error=false;
      }
    }
    return error ? {dniInvalido: "Dni incorrecto"} : null;   
  }


/**
 * Valida si el DNI ya existe en la lista de clientes proporcionada.
 */
public static dniRepetido(listaClientes: any[]) {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Si está vacío, la responsabilidad es de Validators.required
    }

    // Comprobamos si hay algún cliente con el mismo DNI (sin importar mayúsculas)
    const existe = listaClientes.some(cliente => 
      cliente.dni?.trim().toUpperCase() === control.value.trim().toUpperCase()
    );

    // Si existe, devolvemos el error 'dniDuplicado'
    return existe ? { dniDuplicado: true } : null;
  };
}
/**
   * Valida que la fecha no sea posterior a la fecha actual (hoy)
   */
  public static fechaNoFutura(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    const fechaInput = new Date(control.value);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Normalizamos para comparar solo días

    return fechaInput > hoy ? { fechaFutura: true } : null;
  }

  /**
   * Valida que el campo solo contenga letras
   */
  public static soloTexto(control: AbstractControl): ValidationErrors | null {

    if (!control.value) return null;

    const regex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/;

    const valido = regex.test(control.value);

    return valido ? null : { soloTexto: true };
  }

  /**
   * Valida que el campo solo contenga letras
   */
  public static telefono(control: AbstractControl): ValidationErrors | null {

  if (!control.value) return null;

  const regex = /^[0-9]{9}$/;

  const valido = regex.test(control.value);

  return valido ? null : { telefonoInvalido: true };

}
 
    
}
