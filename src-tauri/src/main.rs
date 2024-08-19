// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::fs::File;
use std::io::prelude::*;
use std::io::Result;

static CONFIG_FILL: [&str; 3] = ["0","0","0"];

fn main() {
  match create_settings() {
   Ok(_) => println!("Created config.txt"),
   Err(e) => println!("Error when creating config.txt, Error: {}", e)
  }
  app_lib::run();
}

fn create_settings() -> Result<()> {
    let config_fill = CONFIG_FILL;
    let mut file = File::create("config.txt")?;
    file.write_all(b"")?;
    for set in config_fill {
      writeln!(file, "{}", set)?;
    }
    Ok(())
}
