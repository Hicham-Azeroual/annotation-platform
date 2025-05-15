package com.hicham.annotationplatformproject1;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan("com.hicham.annotationplatformproject1")

public class Annotationplatformproject1Application {

	public static void main(String[] args) {
		SpringApplication.run(Annotationplatformproject1Application.class, args);
	}

}
