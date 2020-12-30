# API controller
class Api::V1::TasksController < ActionController::API
  def index
    render json: Task.all
  end

  def create
    task = Task.create(Task_params)
    render json: task
  end

  def destroy
    Task.destroy(params[:id])
  end

  def update
    task = Task.find(params[:id])
    task.update_attributes(task_params)
    render json: task
  end

  private

  def task_params
    params.require(:task).permit(:id, :name, :description)
  end
end
