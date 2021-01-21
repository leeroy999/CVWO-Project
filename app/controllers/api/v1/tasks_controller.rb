# API controller
class Api::V1::TasksController < ActionController::API
  def index
    render json: Task.all.sort_by {|obj| obj.updated_at }
  end

  def create
    task = Task.create(task_params)
    render json: task
  end

  def destroy
    Task.destroy(params[:id])
  end

  def update
    task = Task.find(params[:id])
    task.update(task_params)
    render json: task
  end

  private

  def task_params
    params.require(:task).permit(:id, :title, :description, :category)
  end
end
