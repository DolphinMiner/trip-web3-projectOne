package com.trip.web3.controller;

import com.trip.web3.service.GreetingService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

@RequestMapping("v1/")
@RestController
public class HelloworldController {

	@Resource
	GreetingService greetingService;

	@GetMapping("/hello")
	public String hello(@RequestParam(value = "name", defaultValue = "World") String name) {
		return String.format("Hello %s!", name);
	}

	/**
	 * *** 慎用deploy ***
	 * @return
	 */
	@GetMapping("/deploy")
	public String deploy() {
		return greetingService.deploy();
	}

	@GetMapping("/greet")
	public String greet() {
		return greetingService.greet();
	}

	@GetMapping("/setGreeting")
	public void setGreeting(@RequestParam(value = "newGreeting", defaultValue = "Hello World!") String newGreeting) {
		greetingService.setGreeting(newGreeting);
	}
}