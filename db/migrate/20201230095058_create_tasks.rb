class CreateTasks < ActiveRecord::Migration[6.1]
  def change
    create_table :tasks do |t|
      t.string :title
      t.text :description
      t.datetime :timeCreated
      t.datetime :timeUpdated
      t.string :category
      t.datetime :dueDate
      t.boolean :completed

      t.timestamps
    end
  end
end
