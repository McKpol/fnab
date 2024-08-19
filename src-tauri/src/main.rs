// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::fs::File;
use std::io::prelude::*;
use std::io::Result;

fn main() {
  match create_settings() {
   Ok(_) => println!("Created config.txt"),
   Err(e) => println!("Error when creating config.txt, Error: {}", e)
  }
  app_lib::run();
}

fn create_settings() -> Result<()> {
    let mut file = File::create("config.txt")?;
    file.write_all(b"")?;
    writeln!(file, "jes")?;
    writeln!(file, "jes")?;
    writeln!(file, "jes")?;
    Ok(())
}
