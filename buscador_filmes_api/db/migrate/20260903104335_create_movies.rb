class CreateMovies < ActiveRecord::Migration[8.1]
  def change
    create_table :movies do |t|
      t.string :title
      t.string :genre
      t.integer :release_year
      t.text :description
      t.decimal :rating
      t.string :poster_url
      t.string :tmdb_id

      t.timestamps
    end
  end
end
