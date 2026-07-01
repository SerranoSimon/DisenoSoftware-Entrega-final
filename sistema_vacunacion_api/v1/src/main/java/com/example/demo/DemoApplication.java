package com.example.demo;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;

import com.example.demo.models.Campania;
import com.example.demo.models.CentroVacunacion;
import com.example.demo.models.EstadoCampania;
import com.example.demo.models.FuncSalud;
import com.example.demo.models.HorarioCentro;
import com.example.demo.models.HorarioFs;
import com.example.demo.models.NotificacionPreferencia;
import com.example.demo.models.Paciente;
import com.example.demo.models.PoblacionObjetivo;
import com.example.demo.models.StockVacuna;
import com.example.demo.models.TipoVacuna;
import com.example.demo.models.Vacuna;
import com.example.demo.repository.CampaniaRepo;
import com.example.demo.repository.CentrosRepo;
import com.example.demo.repository.FuncSaludRepo;
import com.example.demo.repository.HorarioCentroRepo;
import com.example.demo.repository.HorarioFsRepo;
import com.example.demo.repository.PacienteRepo;
import com.example.demo.repository.StockVacunaRepo;
import com.example.demo.repository.TipoVacunaRepo;
import com.example.demo.repository.VacunaRepo;
import com.example.demo.service.FuncSaludService;
import com.example.demo.service.GestorCitas;



@SpringBootApplication
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }


    @Bean
    CommandLineRunner initData(
            CentrosRepo centroRepo,
            PacienteRepo pacienteRepo,
            FuncSaludRepo funcSaludRepo,
            CampaniaRepo campaniaRepo,
            VacunaRepo vacunaRepo,
            TipoVacunaRepo tipoVacunaRepo,
            StockVacunaRepo stockVacunaRepo,
            HorarioCentroRepo horarioCentroRepo,
            HorarioFsRepo horarioFsRepo,
            FuncSaludService funcSaludService,
            GestorCitas gestorCitas
    ) {
        return args -> {

            // 1. --- POBLACIÓN OBJETIVO Y CAMPAÑAS ---
            PoblacionObjetivo adultos = new PoblacionObjetivo(18, 60);
            
            Campania campania1 = new Campania(null, "Campaña covid 2026",
                    LocalDate.of(2026, 1, 1),
                    LocalDate.of(2026, 12, 30),
                    "Campaña anual de covid",
                    EstadoCampania.EN_CURSO,
                    adultos, new ArrayList<>());

            Campania campania2 = new Campania(null, "Campaña influenza 2026",
                    LocalDate.of(2026, 1, 1),
                    LocalDate.of(2026, 12, 30),
                    "Campaña anual de influenza",
                    EstadoCampania.EN_CURSO,
                    adultos, new ArrayList<>());

            // Guardamos la campaña primero para generar su ID
            campania1 = campaniaRepo.save(campania1);
            campania2 = campaniaRepo.save(campania2);    
            // 2. --- CENTROS DE VACUNACIÓN ---
            CentroVacunacion centro1 = new CentroVacunacion(null, "CESFAM O'Higgins ",
                    "CESFAM", "Salas 538, Concepción", new ArrayList<>(), null, null, null);
            CentroVacunacion centro2 = new CentroVacunacion(null, "CESFAM Víctor Manuel Fernández",
                    "CESFAM", "Maipú 2120, Concepción", new ArrayList<>(), null, null, null);
            
            // Guardamos los centros para generar sus IDs de inmediato
            centroRepo.saveAll(List.of(centro1, centro2));


            


            // 4. --- VACUNAS ---
            List<Vacuna> vacunasPzifer = new ArrayList<>();
            List<Vacuna> vacunasAstrazeneca = new ArrayList<>();
            List<Vacuna> vacunasInfluvac = new ArrayList<>();
            TipoVacuna pzifer = new TipoVacuna(null,"pzifer",2,vacunasPzifer);
            TipoVacuna astrazeneca = new TipoVacuna(null,"astrazeneca",1,vacunasAstrazeneca);
            TipoVacuna influvac = new TipoVacuna(null,"influvac",1,vacunasAstrazeneca);   

            tipoVacunaRepo.saveAll(List.of(pzifer, astrazeneca, influvac)); 

            StockVacuna stock1 = new StockVacuna(new ArrayList<>(), campania1, centro1,pzifer);
            StockVacuna stock2 = new StockVacuna(new ArrayList<>(), campania1, centro2,astrazeneca);
            StockVacuna stock3 = new StockVacuna(new ArrayList<>(), campania2, centro2,influvac);
            stockVacunaRepo.saveAll(List.of(stock1, stock2, stock3));
            for (int i = 0; i < 10; i++) {
                vacunasPzifer.add(new Vacuna(null, pzifer, stock1));
                vacunasAstrazeneca.add(new Vacuna(null, astrazeneca, stock2));
                vacunasAstrazeneca.add(new Vacuna(null, influvac, stock3));
            }
            // Guardamos todas las vacunas juntas de manera eficiente

            vacunaRepo.saveAll(vacunasPzifer);
            vacunaRepo.saveAll(vacunasAstrazeneca);
            vacunaRepo.saveAll(vacunasInfluvac);

            // 5. --- HORARIOS CENTRO ---
            HorarioCentro hc1 = new HorarioCentro(null, DayOfWeek.MONDAY,
                    LocalTime.of(8, 0), LocalTime.of(18, 0), centro1);

            HorarioCentro hc2 = new HorarioCentro(null, DayOfWeek.TUESDAY,
                    LocalTime.of(8, 0), LocalTime.of(18, 0), centro1);

            HorarioCentro hc3 = new HorarioCentro(null, DayOfWeek.WEDNESDAY,
                    LocalTime.of(9, 0), LocalTime.of(18, 0), centro2);

            HorarioCentro hc4 = new HorarioCentro(null, DayOfWeek.FRIDAY,
                    LocalTime.of(9, 0), LocalTime.of(15, 0), centro2);                    
            
            horarioCentroRepo.saveAll(List.of(hc1, hc2, hc3,hc4));

            // 6. --- FUNCIONARIOS DE SALUD ---
            FuncSalud func1 = new FuncSalud("12345678-9", "Carlos", "Pérez",
                    912345678, "sserrano2024@inf.udec.cl",
                    LocalDate.of(1985, 3, 15), null,
                    NotificacionPreferencia.CORREOELECTRONICO,
                    centro1);
            FuncSalud func2 = new FuncSalud("98765432-1", "Ana", "González",
                    923738870, "sserrano2024@inf.udec.cl",
                    LocalDate.of(1990, 7, 20), null,
                    NotificacionPreferencia.SMS,
                    centro1);
            FuncSalud func3 = new FuncSalud("22121545-1", "Alfredo", "Castro",
                    923738870, "sserrano2024@inf.udec.cl",
                    LocalDate.of(1990, 7, 20), null,
                    NotificacionPreferencia.SMS,
                    centro2);
            FuncSalud func4 = new FuncSalud("21955190-3", "Thomas", "Sankara",
                    923738870, "sserrano2024@inf.udec.cl",
                    LocalDate.of(1990, 7, 20), null,
                    NotificacionPreferencia.SMS,
                    centro2);                                
            funcSaludRepo.saveAll(List.of(func1, func2,func3,func4));

            // 7. --- HORARIOS FUNCIONARIO ---
            ArrayList<HorarioFs> horarioFs = new ArrayList<>();
            LocalTime horaBase1 = LocalTime.of(8, 0);
            LocalTime horaBase2 = LocalTime.of(12, 0);
            LocalTime horaBase3 = LocalTime.of(9, 0);
            LocalTime horaBase4 = LocalTime.of(11, 0);
            for(int i= 0;i<=12;i++){
                LocalTime inicio1 = horaBase1.plusMinutes(i * 15L);
                LocalTime fin1 = horaBase1.plusMinutes((i + 1) * 15L);
                LocalTime inicio2 = horaBase2.plusMinutes(i * 15L);
                LocalTime fin2 = horaBase2.plusMinutes((i + 1) * 15L);
                LocalTime inicio3 = horaBase3.plusMinutes(i * 15L);
                LocalTime fin3 = horaBase3.plusMinutes((i + 1) * 15L);
                LocalTime inicio4 = horaBase4.plusMinutes(i * 15L);
                LocalTime fin4 = horaBase4.plusMinutes((i + 1) * 15L);
                HorarioFs hf1 = new HorarioFs(DayOfWeek.MONDAY, inicio1, fin1, func1);  
                horarioFs.add(hf1);     
                HorarioFs hf2 = new HorarioFs(DayOfWeek.TUESDAY, inicio2, fin2, func2);  
                horarioFs.add(hf2);
                HorarioFs hf3 = new HorarioFs(DayOfWeek.WEDNESDAY, inicio3, fin3, func3); 
                horarioFs.add(hf3);
                HorarioFs hf4 = new HorarioFs(DayOfWeek.FRIDAY, inicio4, fin4, func4); 
                horarioFs.add(hf4);
            }


          
            horarioFsRepo.saveAll(horarioFs);

            // 8. --- PACIENTES ---
            Paciente paciente1 = new Paciente("7382025-1", "María", "López",
                    923738870, "sserrano2024@inf.udec.cl",
                    LocalDate.of(1995, 5, 10),
                    NotificacionPreferencia.AMBOS);
            Paciente paciente2 = new Paciente("140349593", "Juan", "Martínez",
                    923738870, "sserrano2024@inf.udec.cl",
                    LocalDate.of(1988, 11, 25),
                    NotificacionPreferencia.SMS);
            
            pacienteRepo.saveAll(List.of(paciente1, paciente2));

             //paciente1.solicitarCita(1L, 1L, LocalDateTime.of(2026, 06, 30, 20, 10), gestorCitas);
             //funcSaludService.registrarVacunacion(1L,"11111111-1", "12345678-9", "sin obs");
        };
    }
}