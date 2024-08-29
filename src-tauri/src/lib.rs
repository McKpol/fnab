#[cfg_attr(mobile, tauri::mobile_entry_point)]
mod file;

pub fn run() {
  match file::create_files() {
    Ok(_) => println!("Created file"),
    Err(_) => file::reset_file(0)
   }
 
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![file::reset_file, file::write_file, file::read_file])
    .plugin(tauri_plugin_process::init())
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}